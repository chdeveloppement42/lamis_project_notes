"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt = __importStar(require("bcrypt"));
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:chdev2026@localhost:5432/immo_lamis?schema=public';
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
    const permissionsData = [
        { action: 'view:dashboard', description: 'Accès au tableau de bord' },
        { action: 'manage:providers', description: 'Valider / Rejeter / Suspendre des fournisseurs' },
        { action: 'manage:listings', description: 'Publier / Dépublier / Supprimer des annonces' },
        { action: 'manage:categories', description: 'Ajouter / Modifier / Supprimer des catégories' },
        { action: 'manage:users', description: 'Consulter les utilisateurs / Réinitialiser les mots de passe' },
        { action: 'manage:admins', description: 'Créer / Modifier / Désactiver des comptes administrateurs' },
        { action: 'view:notifications', description: 'Consulter les notifications de la plateforme' },
        { action: 'manage:permissions', description: 'Gérer les rôles et permissions (Super Admin uniquement)' },
        { action: 'read:roles', description: 'Consulter la liste des rôles disponibles' },
    ];
    for (const perm of permissionsData) {
        await prisma.permission.upsert({
            where: { action: perm.action },
            update: {},
            create: perm,
        });
    }
    const allPermissions = await prisma.permission.findMany();
    const superAdminRole = await prisma.role.upsert({
        where: { name: 'Super Admin' },
        update: {},
        create: {
            name: 'Super Admin',
            isDefault: true,
            isSuperAdmin: true,
            permissions: {
                create: allPermissions.map((p) => ({
                    permission: { connect: { id: p.id } },
                })),
            },
        },
    });
    const managerRole = await prisma.role.upsert({
        where: { name: 'Manager' },
        update: {},
        create: {
            name: 'Manager',
            isDefault: true,
            isSuperAdmin: false,
            permissions: {
                create: allPermissions
                    .filter((p) => p.action !== 'manage:permissions')
                    .map((p) => ({
                    permission: { connect: { id: p.id } },
                })),
            },
        },
    });
    await prisma.role.upsert({
        where: { name: 'Modérateur' },
        update: {},
        create: {
            name: 'Modérateur',
            isDefault: true,
            isSuperAdmin: false,
            permissions: {
                create: allPermissions
                    .filter((p) => ['view:dashboard', 'manage:listings', 'view:notifications'].includes(p.action))
                    .map((p) => ({
                    permission: { connect: { id: p.id } },
                })),
            },
        },
    });
    const password = await bcrypt.hash('0000', 10);
    await prisma.admin.upsert({
        where: { email: 'admin@immolamis.com' },
        update: {},
        create: {
            firstName: 'Super',
            lastName: 'Admin',
            email: 'admin@immolamis.com',
            password,
            isSuperAdmin: true,
            status: 'VALIDATED',
            roleId: superAdminRole.id,
        },
    });
    const categoriesData = [
        { name: 'Appartement', slug: 'appartement' },
        { name: 'Villa', slug: 'villa' },
        { name: 'Bureau', slug: 'bureau' },
        { name: 'Terrain', slug: 'terrain' },
        { name: 'Local Commercial', slug: 'local-commercial' },
        { name: 'Entrepôt', slug: 'entrepot' },
    ];
    for (const cat of categoriesData) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: cat,
        });
    }
    console.log('Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map