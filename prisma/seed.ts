import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("coachpassword", 10);
  const email = "coach@exemple.com";

  // Seed Users
  const coach = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email: email,
      name: "John",
      surename: "Doe",
      passwordHash: passwordHash,
      role: "COACH",
    },
  });

  // Data for Appointments and Availabilities
  const day1Start = new Date(Date.now() + 24 * 60 * 60 * 1000);
  day1Start.setHours(9, 0, 0, 0);
  const day1End = new Date(day1Start);
  day1End.setHours(17, 0, 0, 0);

  const day2Start = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  day2Start.setHours(9, 0, 0, 0);
  const day2End = new Date(day2Start);
  day2End.setHours(17, 0, 0, 0);

  const availability = await prisma.availability.createMany({
    data: [
      {
        userId: coach.id,
        startAt: day1Start,
        endAt: day1End,
      },
      {
        userId: coach.id,
        startAt: day2Start,
        endAt: day2End,
      },
    ],
  });

  const appointment1 = await prisma.appointment.create({
    data: {
      userId: coach.id,
      clientName: "Alice Johnson",
      clientEmail: "alice@gmail.com",
      status: "BOOKED",
      startAt: new Date(day1Start.getTime() + 2 * 60 * 60 * 1000),
      endAt: new Date(day1Start.getTime() + 3 * 60 * 60 * 1000),
    },
  });

  const appointment2 = await prisma.appointment.create({
    data: {
      userId: coach.id,
      clientName: "Bob Smith",
      clientEmail: "bob@gmail.com",
      status: "BOOKED",
      startAt: new Date(day2Start.getTime() + 4 * 60 * 60 * 1000),
      endAt: new Date(day2Start.getTime() + 5 * 60 * 60 * 1000),
    },
  });

  console.log({ coach, appointment1, appointment2, availability });

  console.log("Seeding completed.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
