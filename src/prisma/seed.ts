import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.upsert({
        where: { mobile: '1234567890' },
        update: {},
        create: {
            name: 'Test User',
            mobile: '1234567890',
            vehicles: {
                create: {
                    vehicleNumber: 'KA01AB1234',
                    qrCodeId: 'test-qr-id',
                    qrImage: 'data:image/png;base64,test',
                },
            },
        },
    });

    console.log({ user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
