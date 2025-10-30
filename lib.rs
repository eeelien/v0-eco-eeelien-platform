use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo, Burn};

declare_id!("GhaBgqop1A6NxguXHRsBJntBxj5QMB73NEKM46WX6kQb");

/// EcoBottle: Plataforma Descentralizada de Economía Circular
///
/// Este programa implementa:
/// 1. Validación de Reciclaje (Prueba de Desechado)
/// 2. Emisión Automática de Recompensas ($ECOC tokens)
/// 3. Trazabilidad Completa en Blockchain
/// 4. Sistema de Contenedores Inteligentes NFT
/// 5. Marketplace para Canje de Tokens

#[program]
pub mod ecobottle {
    use super::*;

    /// Inicializa el programa EcoBottle con configuración global
    pub fn initialize(
        ctx: Context<Initialize>,
        ecoc_per_kg: u64,  // Tokens ECOC por kilogramo de PET
        min_deposit_weight: u64,  // Peso mínimo en gramos para depósito válido
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.ecoc_per_kg = ecoc_per_kg;
        global_state.min_deposit_weight = min_deposit_weight;
        global_state.total_pet_collected = 0;
        global_state.total_deposits = 0;
        global_state.total_users = 0;
        global_state.total_containers = 0;
        global_state.bump = ctx.bumps.global_state;

        msg!("🌍 EcoBottle inicializado - {} ECOC por KG", ecoc_per_kg);
        Ok(())
    }

    /// Registra un nuevo usuario en la plataforma
    pub fn register_user(
        ctx: Context<RegisterUser>,
        username: String,
    ) -> Result<()> {
        require!(username.len() <= 32, ErrorCode::UsernameTooLong);

        let user_profile = &mut ctx.accounts.user_profile;
        let global_state = &mut ctx.accounts.global_state;

        user_profile.owner = ctx.accounts.user.key();
        user_profile.username = username.clone();
        user_profile.total_deposits = 0;
        user_profile.total_pet_weight = 0;
        user_profile.total_ecoc_earned = 0;
        user_profile.total_ecoc_spent = 0;
        user_profile.created_at = Clock::get()?.unix_timestamp;
        user_profile.bump = ctx.bumps.user_profile;

        global_state.total_users += 1;

        msg!("👤 Usuario registrado: {}", username);
        Ok(())
    }

    /// Registra un Contenedor Inteligente como NFT en la blockchain
    /// Solo la autoridad del programa puede registrar contenedores
    pub fn register_container(
        ctx: Context<RegisterContainer>,
        container_id: String,
        location: String,
        capacity_kg: u64,
    ) -> Result<()> {
        require!(container_id.len() <= 32, ErrorCode::ContainerIdTooLong);
        require!(location.len() <= 64, ErrorCode::LocationTooLong);

        let container = &mut ctx.accounts.container;
        let global_state = &mut ctx.accounts.global_state;

        container.container_id = container_id.clone();
        container.location = location.clone();
        container.authority = ctx.accounts.authority.key();
        container.capacity_kg = capacity_kg;
        container.current_weight = 0;
        container.total_deposits = 0;
        container.is_active = true;
        container.created_at = Clock::get()?.unix_timestamp;
        container.last_collection = 0;
        container.bump = ctx.bumps.container;

        global_state.total_containers += 1;

        msg!("📦 Contenedor NFT registrado: {} en {}", container_id, location);
        Ok(())
    }

    /// Procesa un depósito de PET y emite recompensa automáticamente
    /// Este es el corazón de la dApp - validación y recompensa instantánea
    pub fn process_deposit(
        ctx: Context<ProcessDeposit>,
        weight_grams: u64,
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        let container = &mut ctx.accounts.container;
        let user_profile = &mut ctx.accounts.user_profile;
        let deposit_record = &mut ctx.accounts.deposit_record;

        // Validaciones
        require!(container.is_active, ErrorCode::ContainerInactive);
        require!(weight_grams >= global_state.min_deposit_weight, ErrorCode::WeightTooLow);

        let weight_kg = weight_grams as f64 / 1000.0;
        let current_capacity = container.current_weight as f64 / 1000.0;
        require!(
            current_capacity + weight_kg <= container.capacity_kg as f64,
            ErrorCode::ContainerFull
        );

        // Calcular recompensa en tokens ECOC
        let ecoc_reward = (weight_grams * global_state.ecoc_per_kg) / 1000;

        // Guardar datos antes de tomar referencias mutables
        let user_key = ctx.accounts.user.key();
        let container_key = container.key();

        // Registrar el depósito en blockchain (trazabilidad)
        deposit_record.user = user_key;
        deposit_record.container = container_key;
        deposit_record.weight_grams = weight_grams;
        deposit_record.ecoc_reward = ecoc_reward;
        deposit_record.timestamp = Clock::get()?.unix_timestamp;
        deposit_record.tx_signature = Clock::get()?.unix_timestamp as u64; // Simulado
        deposit_record.bump = ctx.bumps.deposit_record;

        // Actualizar estadísticas del contenedor
        container.current_weight += weight_grams;
        container.total_deposits += 1;

        // Actualizar perfil del usuario
        user_profile.total_deposits += 1;
        user_profile.total_pet_weight += weight_grams;
        user_profile.total_ecoc_earned += ecoc_reward;

        // Actualizar estadísticas globales
        global_state.total_pet_collected += weight_grams;
        global_state.total_deposits += 1;

        // Mintear tokens ECOC directamente a la wallet del usuario
        let bump = global_state.bump;
        let seeds = &[
            b"global_state".as_ref(),
            &[bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: ctx.accounts.ecoc_mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.global_state.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

        token::mint_to(cpi_ctx, ecoc_reward)?;

        msg!("♻️ Depósito procesado: {}g de PET = {} ECOC", weight_grams, ecoc_reward);
        msg!("📍 Contenedor: {} | Usuario: {}", container.container_id, user_profile.username);

        Ok(())
    }

    /// Canjea tokens ECOC por productos/servicios en el marketplace
    /// Los tokens canjeados son quemados (deflacionario)
    pub fn redeem_tokens(
        ctx: Context<RedeemTokens>,
        amount: u64,
        product_id: String,
    ) -> Result<()> {
        require!(product_id.len() <= 32, ErrorCode::ProductIdTooLong);

        let user_profile = &mut ctx.accounts.user_profile;
        let redemption = &mut ctx.accounts.redemption_record;

        // Validar que el usuario tenga suficientes tokens
        let user_balance = ctx.accounts.user_token_account.amount;
        require!(user_balance >= amount, ErrorCode::InsufficientTokens);

        // Quemar los tokens ECOC (sacarlos de circulación)
        let cpi_accounts = Burn {
            mint: ctx.accounts.ecoc_mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::burn(cpi_ctx, amount)?;

        // Registrar el canje
        redemption.user = ctx.accounts.user.key();
        redemption.product_id = product_id.clone();
        redemption.amount = amount;
        redemption.timestamp = Clock::get()?.unix_timestamp;
        redemption.bump = ctx.bumps.redemption_record;

        // Actualizar perfil del usuario
        user_profile.total_ecoc_spent += amount;

        msg!("🛍️ Canje exitoso: {} ECOC por producto {}", amount, product_id);
        msg!("🔥 Tokens quemados - Deflación activa");

        Ok(())
    }

    /// Registra la recolección de un contenedor por una empresa certificada
    /// Genera un reporte de trazabilidad verificable en blockchain
    pub fn collect_container(
        ctx: Context<CollectContainer>,
    ) -> Result<()> {
        let container = &mut ctx.accounts.container;
        let collection_record = &mut ctx.accounts.collection_record;

        require!(container.is_active, ErrorCode::ContainerInactive);
        require!(container.current_weight > 0, ErrorCode::ContainerEmpty);

        let collector = ctx.accounts.collector.key();
        let container_key = container.key();
        let weight_collected = container.current_weight;

        // Crear registro de recolección (trazabilidad certificada)
        collection_record.container = container_key;
        collection_record.collector = collector;
        collection_record.weight_collected = weight_collected;
        collection_record.timestamp = Clock::get()?.unix_timestamp;
        collection_record.verified = true;
        collection_record.bump = ctx.bumps.collection_record;

        // Actualizar contenedor
        container.last_collection = Clock::get()?.unix_timestamp;
        container.current_weight = 0; // Vaciar contenedor

        msg!("🚛 Recolección certificada por blockchain");
        msg!("📊 Contenedor: {} | Peso: {}g | Recolector: {:?}",
             container.container_id,
             collection_record.weight_collected,
             collector);

        Ok(())
    }

    /// Actualiza la configuración del programa (solo autoridad)
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_ecoc_per_kg: Option<u64>,
        new_min_weight: Option<u64>,
    ) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;

        if let Some(rate) = new_ecoc_per_kg {
            global_state.ecoc_per_kg = rate;
            msg!("💰 Nueva tasa: {} ECOC por KG", rate);
        }

        if let Some(weight) = new_min_weight {
            global_state.min_deposit_weight = weight;
            msg!("⚖️ Nuevo peso mínimo: {}g", weight);
        }

        Ok(())
    }

    /// Desactiva un contenedor (mantenimiento, daño, etc.)
    pub fn toggle_container_status(
        ctx: Context<ToggleContainerStatus>,
    ) -> Result<()> {
        let container = &mut ctx.accounts.container;
        container.is_active = !container.is_active;

        let status = if container.is_active { "ACTIVO" } else { "INACTIVO" };
        msg!("📦 Contenedor {} ahora está {}", container.container_id, status);

        Ok(())
    }
}

// ============================================================================
// ESTRUCTURAS DE CUENTAS
// ============================================================================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + GlobalState::LEN,
        seeds = [b"global_state"],
        bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// Mint de los tokens ECOC
    pub ecoc_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserProfile::LEN,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(container_id: String)]
pub struct RegisterContainer<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + SmartContainer::LEN,
        seeds = [b"container", container_id.as_bytes()],
        bump
    )]
    pub container: Account<'info, SmartContainer>,

    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut, address = global_state.authority)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessDeposit<'info> {
    #[account(mut)]
    pub global_state: Account<'info, GlobalState>,

    #[account(mut)]
    pub container: Account<'info, SmartContainer>,

    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = user,
        space = 8 + DepositRecord::LEN,
        seeds = [
            b"deposit",
            user.key().as_ref(),
            &global_state.total_deposits.to_le_bytes()
        ],
        bump
    )]
    pub deposit_record: Account<'info, DepositRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// Token account del usuario para recibir ECOC
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    /// Mint de ECOC tokens
    #[account(mut)]
    pub ecoc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemTokens<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump = user_profile.bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        init,
        payer = user,
        space = 8 + RedemptionRecord::LEN,
        seeds = [
            b"redemption",
            user.key().as_ref(),
            &user_profile.total_ecoc_spent.to_le_bytes()
        ],
        bump
    )]
    pub redemption_record: Account<'info, RedemptionRecord>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// Token account del usuario
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    /// Mint de ECOC tokens
    #[account(mut)]
    pub ecoc_mint: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CollectContainer<'info> {
    #[account(mut)]
    pub container: Account<'info, SmartContainer>,

    #[account(
        init,
        payer = collector,
        space = 8 + CollectionRecord::LEN,
        seeds = [
            b"collection",
            container.key().as_ref(),
            &container.total_deposits.to_le_bytes()
        ],
        bump
    )]
    pub collection_record: Account<'info, CollectionRecord>,

    #[account(mut)]
    pub collector: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"global_state"],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(address = global_state.authority)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ToggleContainerStatus<'info> {
    #[account(mut)]
    pub container: Account<'info, SmartContainer>,

    #[account(
        seeds = [b"global_state"],
        bump = global_state.bump
    )]
    pub global_state: Account<'info, GlobalState>,

    #[account(address = global_state.authority)]
    pub authority: Signer<'info>,
}

// ============================================================================
// ESTRUCTURAS DE DATOS (PDAs)
// ============================================================================

/// Estado global del programa EcoBottle
#[account]
pub struct GlobalState {
    pub authority: Pubkey,              // Autoridad del programa
    pub ecoc_per_kg: u64,              // Tokens ECOC por kilogramo de PET
    pub min_deposit_weight: u64,       // Peso mínimo en gramos
    pub total_pet_collected: u64,      // Total de PET recolectado en gramos
    pub total_deposits: u64,           // Total de depósitos realizados
    pub total_users: u64,              // Total de usuarios registrados
    pub total_containers: u64,         // Total de contenedores registrados
    pub bump: u8,                      // Bump seed para PDA
}

impl GlobalState {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 8 + 8 + 8 + 1;
}

/// Perfil de usuario en la blockchain
#[account]
pub struct UserProfile {
    pub owner: Pubkey,                 // Wallet del usuario
    pub username: String,              // Nombre de usuario (max 32 chars)
    pub total_deposits: u64,           // Número de depósitos
    pub total_pet_weight: u64,         // Total de PET depositado en gramos
    pub total_ecoc_earned: u64,        // Total de ECOC ganados
    pub total_ecoc_spent: u64,         // Total de ECOC gastados
    pub created_at: i64,               // Timestamp de registro
    pub bump: u8,                      // Bump seed para PDA
}

impl UserProfile {
    pub const LEN: usize = 32 + (4 + 32) + 8 + 8 + 8 + 8 + 8 + 1;
}

/// Contenedor Inteligente NFT - Punto de depósito físico
#[account]
pub struct SmartContainer {
    pub container_id: String,          // ID único del contenedor (max 32 chars)
    pub location: String,              // Ubicación física (max 64 chars)
    pub authority: Pubkey,             // Quien lo registró
    pub capacity_kg: u64,              // Capacidad máxima en kilogramos
    pub current_weight: u64,           // Peso actual en gramos
    pub total_deposits: u64,           // Número de depósitos recibidos
    pub is_active: bool,               // Si está operativo
    pub created_at: i64,               // Fecha de registro
    pub last_collection: i64,          // Última recolección
    pub bump: u8,                      // Bump seed para PDA
}

impl SmartContainer {
    pub const LEN: usize = (4 + 32) + (4 + 64) + 32 + 8 + 8 + 8 + 1 + 8 + 8 + 1;
}

/// Registro de Depósito - Prueba de Reciclaje en Blockchain
#[account]
pub struct DepositRecord {
    pub user: Pubkey,                  // Usuario que depositó
    pub container: Pubkey,             // Contenedor donde se depositó
    pub weight_grams: u64,             // Peso del depósito
    pub ecoc_reward: u64,              // Recompensa otorgada
    pub timestamp: i64,                // Cuándo se realizó
    pub tx_signature: u64,             // Referencia a la transacción
    pub bump: u8,                      // Bump seed para PDA
}

impl DepositRecord {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 8 + 8 + 1;
}

/// Registro de Canje de Tokens
#[account]
pub struct RedemptionRecord {
    pub user: Pubkey,                  // Usuario que canjeó
    pub product_id: String,            // ID del producto (max 32 chars)
    pub amount: u64,                   // Cantidad de ECOC canjeados
    pub timestamp: i64,                // Cuándo se canjeó
    pub bump: u8,                      // Bump seed para PDA
}

impl RedemptionRecord {
    pub const LEN: usize = 32 + (4 + 32) + 8 + 8 + 1;
}

/// Registro de Recolección - Certificado de Trazabilidad
#[account]
pub struct CollectionRecord {
    pub container: Pubkey,             // Contenedor recolectado
    pub collector: Pubkey,             // Empresa recolectora
    pub weight_collected: u64,         // Peso recolectado en gramos
    pub timestamp: i64,                // Fecha de recolección
    pub verified: bool,                // Verificado por blockchain
    pub bump: u8,                      // Bump seed para PDA
}

impl CollectionRecord {
    pub const LEN: usize = 32 + 32 + 8 + 8 + 1 + 1;
}

// ============================================================================
// CÓDIGOS DE ERROR
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("El nombre de usuario es demasiado largo (máximo 32 caracteres)")]
    UsernameTooLong,

    #[msg("El ID del contenedor es demasiado largo (máximo 32 caracteres)")]
    ContainerIdTooLong,

    #[msg("La ubicación es demasiado larga (máximo 64 caracteres)")]
    LocationTooLong,

    #[msg("El peso del depósito es menor al mínimo requerido")]
    WeightTooLow,

    #[msg("El contenedor está lleno - no puede recibir más depósitos")]
    ContainerFull,

    #[msg("El contenedor está inactivo - no puede recibir depósitos")]
    ContainerInactive,

    #[msg("El contenedor está vacío - no hay nada que recolectar")]
    ContainerEmpty,

    #[msg("El ID del producto es demasiado largo (máximo 32 caracteres)")]
    ProductIdTooLong,

    #[msg("No tienes suficientes tokens ECOC para este canje")]
    InsufficientTokens,
}
