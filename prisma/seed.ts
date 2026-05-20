import {
  PrismaClient,
  Role,
  MachineStatus,
  AssetKind,
  AssetStatus,
  ProcurementStatus,
  LabRoleType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const alphaPassword = process.env.SEED_ALPHA_PASSWORD ?? "AlphaTest@123";
  const hashedPassword = await bcrypt.hash(alphaPassword, 12);

  // ─── Users ──────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@plaksha.edu.in" },
    update: {
      name: "Lab Manager",
      role: Role.ADMIN,
      hashedPassword,
    },
    create: {
      name: "Lab Manager",
      email: "admin@plaksha.edu.in",
      role: Role.ADMIN,
      hashedPassword,
    },
  });

  const mentor1 = await prisma.user.upsert({
    where: { email: "rajesh.kumar@plaksha.edu.in" },
    update: {
      name: "Rajesh Kumar",
      role: Role.MENTOR,
      hashedPassword,
    },
    create: {
      name: "Rajesh Kumar",
      email: "rajesh.kumar@plaksha.edu.in",
      role: Role.MENTOR,
      hashedPassword,
    },
  });

  const mentor2 = await prisma.user.upsert({
    where: { email: "priya.sharma@plaksha.edu.in" },
    update: {
      name: "Priya Sharma",
      role: Role.MENTOR,
      hashedPassword,
    },
    create: {
      name: "Priya Sharma",
      email: "priya.sharma@plaksha.edu.in",
      role: Role.MENTOR,
      hashedPassword,
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: "arjun.patel@plaksha.edu.in" },
    update: {
      name: "Arjun Patel",
      role: Role.STUDENT,
      hashedPassword,
    },
    create: {
      name: "Arjun Patel",
      email: "arjun.patel@plaksha.edu.in",
      role: Role.STUDENT,
      hashedPassword,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: "sneha.reddy@plaksha.edu.in" },
    update: {
      name: "Sneha Reddy",
      role: Role.STUDENT,
      hashedPassword,
    },
    create: {
      name: "Sneha Reddy",
      email: "sneha.reddy@plaksha.edu.in",
      role: Role.STUDENT,
      hashedPassword,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: "vikram.singh@plaksha.edu.in" },
    update: {
      name: "Vikram Singh",
      role: Role.STUDENT,
      hashedPassword,
    },
    create: {
      name: "Vikram Singh",
      email: "vikram.singh@plaksha.edu.in",
      role: Role.STUDENT,
      hashedPassword,
    },
  });

  const student4 = await prisma.user.upsert({
    where: { email: "ananya.gupta@plaksha.edu.in" },
    update: {
      name: "Ananya Gupta",
      role: Role.STUDENT,
      hashedPassword,
    },
    create: {
      name: "Ananya Gupta",
      email: "ananya.gupta@plaksha.edu.in",
      role: Role.STUDENT,
      hashedPassword,
    },
  });

  console.log("  Users created");

  // ─── Machines ───────────────────────────────────────
  const machines = await Promise.all([
    prisma.machine.create({
      data: {
        name: "Ultimaker S5",
        description:
          "Dual-extrusion 3D printer with a large build volume (330 x 240 x 300 mm). Supports PLA, ABS, Nylon, TPU, and composite materials.",
        category: "3D Printing",
        location: "Room 101, Bay 1",
        status: MachineStatus.AVAILABLE,
        costPerHour: 150,
        requiresTraining: true,
        safetyRequirements:
          "Do not touch the heated nozzle or build plate. Ensure proper ventilation when printing ABS. Wear gloves when removing supports.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Prusa i3 MK3S+",
        description:
          "Reliable single-extrusion FDM printer. Build volume: 250 x 210 x 210 mm. Auto bed leveling, filament sensor.",
        category: "3D Printing",
        location: "Room 101, Bay 2",
        status: MachineStatus.AVAILABLE,
        costPerHour: 100,
        requiresTraining: true,
        safetyRequirements:
          "Keep hands away from moving parts. Do not leave prints unattended for extended periods.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Formlabs Form 3+",
        description:
          "SLA resin 3D printer for high-detail prototypes. Build volume: 145 x 145 x 185 mm. 25-micron layer resolution.",
        category: "3D Printing",
        location: "Room 101, Bay 3",
        status: MachineStatus.AVAILABLE,
        costPerHour: 250,
        requiresTraining: true,
        safetyRequirements:
          "Always wear nitrile gloves when handling resin. Use in ventilated area. IPA wash station required after print.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Epilog Fusion Pro 48",
        description:
          "CO2 laser cutter/engraver. Cutting area: 1219 x 914 mm. Cuts wood, acrylic, leather, fabric. Engraves metal, glass.",
        category: "Laser Cutting",
        location: "Room 102",
        status: MachineStatus.AVAILABLE,
        costPerHour: 300,
        requiresTraining: true,
        safetyRequirements:
          "Never operate without exhaust ventilation running. Never leave the machine unattended while cutting. Do not cut PVC, vinyl, or polycarbonate (toxic fumes). Wear safety glasses.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Trotec Speedy 360",
        description:
          "High-speed CO2 laser for engraving and cutting. Work area: 813 x 508 mm. Excellent for detailed work.",
        category: "Laser Cutting",
        location: "Room 102",
        status: MachineStatus.IN_USE,
        costPerHour: 280,
        requiresTraining: true,
        safetyRequirements:
          "Same safety protocols as Epilog. Check material compatibility before cutting.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Roland MDX-50 CNC Mill",
        description:
          "Desktop CNC milling machine for precision prototyping. Work area: 400 x 305 x 135 mm. Mills wax, wood, plastics, aluminum.",
        category: "CNC Machining",
        location: "Room 103",
        status: MachineStatus.AVAILABLE,
        costPerHour: 200,
        requiresTraining: true,
        safetyRequirements:
          "Wear safety glasses. Secure workpiece firmly. Never open the enclosure while spindle is running. Use dust collection.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Shopbot PRSalpha CNC Router",
        description:
          "Full-size CNC router for large-format cutting. Work area: 2440 x 1220 mm. Cuts wood, MDF, plastics, foams.",
        category: "CNC Machining",
        location: "Room 103",
        status: MachineStatus.MAINTENANCE,
        costPerHour: 350,
        requiresTraining: true,
        safetyRequirements:
          "Hearing protection required. Ensure dust collection is running. Secure all clamps before starting. Keep hands away from the cutting path.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Markforged Mark Two",
        description:
          "Continuous fiber reinforcement 3D printer. Prints carbon fiber, fiberglass, and Kevlar reinforced nylon parts.",
        category: "3D Printing",
        location: "Room 101, Bay 4",
        status: MachineStatus.AVAILABLE,
        costPerHour: 400,
        requiresTraining: true,
        safetyRequirements:
          "Handle fiber spools carefully. Do not bend or kink fiber. Wear gloves when handling carbon fiber parts (splinters).",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Soldering Station (Weller WE1010)",
        description:
          "Temperature-controlled soldering station for PCB assembly and electronics prototyping. Multiple tip options available.",
        category: "Electronics",
        location: "Room 104, Bench 1-6",
        status: MachineStatus.AVAILABLE,
        costPerHour: 0,
        requiresTraining: false,
        safetyRequirements:
          "Use fume extractor. Do not touch hot tip. Tin the tip after use. Wash hands after soldering (lead-free solder only).",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Oscilloscope (Rigol DS1054Z)",
        description:
          "4-channel digital oscilloscope. 50 MHz bandwidth, 1 GSa/s sample rate. Essential for electronics debugging.",
        category: "Electronics",
        location: "Room 104, Bench 1-6",
        status: MachineStatus.AVAILABLE,
        costPerHour: 0,
        requiresTraining: false,
      },
    }),
    prisma.machine.create({
      data: {
        name: "Drill Press (Bosch)",
        description:
          "Benchtop drill press for precise hole drilling in wood, metal, and plastic. Variable speed.",
        category: "Woodworking",
        location: "Room 105",
        status: MachineStatus.AVAILABLE,
        costPerHour: 50,
        requiresTraining: true,
        safetyRequirements:
          "Wear safety glasses. Secure workpiece with clamp. No loose clothing or jewelry. Tie back long hair.",
      },
    }),
    prisma.machine.create({
      data: {
        name: "Band Saw (DeWalt)",
        description:
          "Vertical band saw for curved and straight cuts in wood and soft metals. 14-inch throat capacity.",
        category: "Woodworking",
        location: "Room 105",
        status: MachineStatus.AVAILABLE,
        costPerHour: 75,
        requiresTraining: true,
        safetyRequirements:
          "Keep fingers away from blade. Use push sticks for small pieces. Wear safety glasses. Check blade tension before use.",
      },
    }),
  ]);

  console.log(`  ${machines.length} machines created`);

  // ─── Materials ──────────────────────────────────────
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        name: "PLA Filament (White)",
        description: "1.75mm PLA filament, 1kg spool. General-purpose 3D printing.",
        category: "Filaments",
        unit: "kg",
        costPerUnit: 1200,
        currentStock: 15,
        lowStockThreshold: 5,
      },
    }),
    prisma.material.create({
      data: {
        name: "PLA Filament (Black)",
        description: "1.75mm PLA filament, 1kg spool.",
        category: "Filaments",
        unit: "kg",
        costPerUnit: 1200,
        currentStock: 8,
        lowStockThreshold: 5,
      },
    }),
    prisma.material.create({
      data: {
        name: "ABS Filament (Gray)",
        description: "1.75mm ABS filament, 1kg spool. Requires heated bed and enclosure.",
        category: "Filaments",
        unit: "kg",
        costPerUnit: 1400,
        currentStock: 4,
        lowStockThreshold: 5,
      },
    }),
    prisma.material.create({
      data: {
        name: "TPU Filament (Blue)",
        description: "1.75mm flexible TPU filament, 0.5kg spool.",
        category: "Filaments",
        unit: "kg",
        costPerUnit: 2800,
        currentStock: 2,
        lowStockThreshold: 2,
      },
    }),
    prisma.material.create({
      data: {
        name: "Standard Resin (Clear)",
        description: "Formlabs standard resin, 1L bottle. For Form 3+.",
        category: "Resins",
        unit: "liter",
        costPerUnit: 4500,
        currentStock: 3,
        lowStockThreshold: 2,
      },
    }),
    prisma.material.create({
      data: {
        name: "Birch Plywood 3mm",
        description: "600 x 400 mm birch plywood sheets. Ideal for laser cutting.",
        category: "Wood",
        unit: "sheets",
        costPerUnit: 120,
        currentStock: 50,
        lowStockThreshold: 15,
      },
    }),
    prisma.material.create({
      data: {
        name: "Birch Plywood 6mm",
        description: "600 x 400 mm birch plywood sheets.",
        category: "Wood",
        unit: "sheets",
        costPerUnit: 180,
        currentStock: 30,
        lowStockThreshold: 10,
      },
    }),
    prisma.material.create({
      data: {
        name: "Acrylic Sheet (Clear) 3mm",
        description: "600 x 400 mm clear acrylic. Laser-safe.",
        category: "Plastics",
        unit: "sheets",
        costPerUnit: 250,
        currentStock: 25,
        lowStockThreshold: 8,
      },
    }),
    prisma.material.create({
      data: {
        name: "Acrylic Sheet (Colored) 3mm",
        description: "600 x 400 mm colored acrylic. Multiple colors available.",
        category: "Plastics",
        unit: "sheets",
        costPerUnit: 300,
        currentStock: 5,
        lowStockThreshold: 8,
      },
    }),
    prisma.material.create({
      data: {
        name: "Arduino Uno R3",
        description: "ATmega328P microcontroller board. 14 digital I/O, 6 analog inputs.",
        category: "Electronics",
        unit: "pieces",
        costPerUnit: 450,
        currentStock: 20,
        lowStockThreshold: 5,
      },
    }),
    prisma.material.create({
      data: {
        name: "ESP32 DevKit",
        description: "Wi-Fi + Bluetooth development board. Dual-core, 240 MHz.",
        category: "Electronics",
        unit: "pieces",
        costPerUnit: 380,
        currentStock: 15,
        lowStockThreshold: 5,
      },
    }),
    prisma.material.create({
      data: {
        name: "Jumper Wires (M-M) Pack",
        description: "40-piece male-to-male jumper wire set, 20cm.",
        category: "Electronics",
        unit: "packs",
        costPerUnit: 80,
        currentStock: 30,
        lowStockThreshold: 10,
      },
    }),
    prisma.material.create({
      data: {
        name: "Lead-Free Solder Wire",
        description: "0.8mm Sn99.3Cu0.7, 100g spool.",
        category: "Electronics",
        unit: "spools",
        costPerUnit: 350,
        currentStock: 8,
        lowStockThreshold: 3,
      },
    }),
    prisma.material.create({
      data: {
        name: "Hot Glue Sticks",
        description: "11mm diameter, 200mm length. General purpose adhesive.",
        category: "Adhesives",
        unit: "pieces",
        costPerUnit: 5,
        currentStock: 200,
        lowStockThreshold: 50,
      },
    }),
    prisma.material.create({
      data: {
        name: "Sandpaper Assortment",
        description: "Mixed grit (80/120/220/400), A4 sheets.",
        category: "Finishing",
        unit: "sheets",
        costPerUnit: 15,
        currentStock: 100,
        lowStockThreshold: 25,
      },
    }),
  ]);

  console.log(`  ${materials.length} materials created`);

  // ─── Training Records ──────────────────────────────
  const trainingRecords = await Promise.all([
    // Arjun is trained on 3D printers and laser cutter
    prisma.training.create({
      data: { userId: student1.id, machineId: machines[0].id, trainedBy: admin.name },
    }),
    prisma.training.create({
      data: { userId: student1.id, machineId: machines[1].id, trainedBy: admin.name },
    }),
    prisma.training.create({
      data: { userId: student1.id, machineId: machines[3].id, trainedBy: mentor1.name },
    }),
    // Sneha is trained on resin printer and CNC mill
    prisma.training.create({
      data: { userId: student2.id, machineId: machines[2].id, trainedBy: admin.name },
    }),
    prisma.training.create({
      data: { userId: student2.id, machineId: machines[5].id, trainedBy: mentor2.name },
    }),
    // Vikram is trained on laser cutter and woodworking
    prisma.training.create({
      data: { userId: student3.id, machineId: machines[3].id, trainedBy: mentor1.name },
    }),
    prisma.training.create({
      data: { userId: student3.id, machineId: machines[10].id, trainedBy: admin.name },
    }),
    prisma.training.create({
      data: { userId: student3.id, machineId: machines[11].id, trainedBy: admin.name },
    }),
    // Ananya is trained on Prusa and electronics (no training needed for soldering/oscilloscope)
    prisma.training.create({
      data: { userId: student4.id, machineId: machines[1].id, trainedBy: mentor2.name },
    }),
  ]);

  console.log(`  ${trainingRecords.length} training records created`);

  // ─── Sample Project ─────────────────────────────────
  const project = await prisma.project.create({
    data: {
      name: "Smart Campus Weather Station",
      description:
        "IoT weather station for the Plaksha campus. Measures temperature, humidity, pressure, wind speed, and rainfall. Data displayed on a web dashboard.",
      mentorId: mentor1.id,
      members: {
        create: [
          { userId: student1.id, role: "LEAD" },
          { userId: student4.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log(`  Project "${project.name}" created`);

  // ─── Mentor Availability ────────────────────────────
  await Promise.all([
    // Rajesh: Mon, Wed, Fri 10:00-12:00 and 14:00-16:00
    ...[1, 3, 5].flatMap((day) => [
      prisma.mentorAvailability.create({
        data: { userId: mentor1.id, dayOfWeek: day, startTime: "10:00", endTime: "12:00" },
      }),
      prisma.mentorAvailability.create({
        data: { userId: mentor1.id, dayOfWeek: day, startTime: "14:00", endTime: "16:00" },
      }),
    ]),
    // Priya: Tue, Thu 09:00-12:00
    ...[2, 4].map((day) =>
      prisma.mentorAvailability.create({
        data: { userId: mentor2.id, dayOfWeek: day, startTime: "09:00", endTime: "12:00" },
      })
    ),
  ]);

  console.log("  Mentor availability set");

  // ─── Sample Bookings ─────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  dayAfter.setHours(14, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(9, 0, 0, 0);

  await Promise.all([
    // Arjun books Ultimaker S5 for tomorrow
    prisma.booking.create({
      data: {
        userId: student1.id,
        machineId: machines[0].id,
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000),
        status: "CONFIRMED",
        purpose: "Print enclosure for weather station project",
      },
    }),
    // Sneha books Form 3+ for day after
    prisma.booking.create({
      data: {
        userId: student2.id,
        machineId: machines[2].id,
        startTime: dayAfter,
        endTime: new Date(dayAfter.getTime() + 3 * 60 * 60 * 1000),
        status: "PENDING",
        purpose: "Print high-detail sensor mounts",
      },
    }),
    // Vikram books mentor session with Rajesh next week
    prisma.booking.create({
      data: {
        userId: student3.id,
        mentorId: mentor1.id,
        startTime: nextWeek,
        endTime: new Date(nextWeek.getTime() + 1 * 60 * 60 * 1000),
        status: "CONFIRMED",
        purpose: "Review CNC machining approach for drone frame",
      },
    }),
    // Ananya books Prusa for next week
    prisma.booking.create({
      data: {
        userId: student4.id,
        machineId: machines[1].id,
        startTime: new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000),
        endTime: new Date(nextWeek.getTime() + 7 * 60 * 60 * 1000),
        status: "PENDING",
        purpose: "Print parts for robotics club competition",
      },
    }),
  ]);

  console.log("  Sample bookings created");

  // --- Multi-lab backfill ---

  console.log("\n  Starting multi-lab backfill...");

  // ─── Labs ─────────────────────────────────────────────
  const makerspace = await prisma.lab.upsert({
    where: { slug: "makerspace" },
    update: { name: "Plaksha Makerspace" },
    create: {
      slug: "makerspace",
      name: "Plaksha Makerspace",
      description: "Main fabrication lab with 3D printers, laser cutters, CNC machines, and woodworking equipment.",
      location: "Building A, Rooms 101-105",
      contactEmail: "makerspace@plaksha.edu.in",
      isPublic: true,
    },
  });

  const robotics = await prisma.lab.upsert({
    where: { slug: "robotics" },
    update: { name: "Plaksha Robotics Lab" },
    create: {
      slug: "robotics",
      name: "Plaksha Robotics Lab",
      description: "Robotics research and build lab with mechanical and electronics divisions.",
      location: "Building B, Room 201",
      contactEmail: "robotics@plaksha.edu.in",
      isPublic: true,
    },
  });

  console.log("  Labs upserted");

  // ─── Lab Divisions (Robotics only) ────────────────────
  const divMechanical = await prisma.labDivision.upsert({
    where: { labId_slug: { labId: robotics.id, slug: "mechanical" } },
    update: { name: "Mechanical" },
    create: {
      labId: robotics.id,
      slug: "mechanical",
      name: "Mechanical",
      description: "Mechanical design, fabrication, and assembly.",
    },
  });

  const divElectronics = await prisma.labDivision.upsert({
    where: { labId_slug: { labId: robotics.id, slug: "electronics" } },
    update: { name: "Electronics" },
    create: {
      labId: robotics.id,
      slug: "electronics",
      name: "Electronics",
      description: "PCB design, embedded systems, and sensor integration.",
    },
  });

  console.log("  Lab divisions upserted");

  // ─── Backfill labId on existing Machines ────────────────
  await prisma.machine.updateMany({
    where: { labId: null },
    data: { labId: makerspace.id },
  });
  console.log("  Machines backfilled to Makerspace");

  // ─── Backfill labId on existing Materials ────────────────
  await prisma.material.updateMany({
    where: { labId: null },
    data: { labId: makerspace.id },
  });
  console.log("  Materials backfilled to Makerspace");

  // ─── Backfill labId on existing Bookings ─────────────────
  await prisma.booking.updateMany({
    where: { labId: null },
    data: { labId: makerspace.id },
  });
  console.log("  Bookings backfilled to Makerspace");

  // ─── Backfill labId on existing Projects ─────────────────
  await prisma.project.updateMany({
    where: { labId: null },
    data: { labId: makerspace.id },
  });
  console.log("  Projects backfilled to Makerspace");

  // ─── Backfill labId on existing MaterialRequests ──────────
  await prisma.materialRequest.updateMany({
    where: { labId: null },
    data: { labId: makerspace.id },
  });
  console.log("  MaterialRequests backfilled to Makerspace");

  // ─── Asset rows for each Machine (idempotent via machineId unique) ──
  // Re-fetch machines so we have their labId populated
  const allMachines = await prisma.machine.findMany({ where: { labId: makerspace.id } });

  // Map MachineStatus -> AssetStatus
  function machineStatusToAssetStatus(ms: MachineStatus): AssetStatus {
    switch (ms) {
      case MachineStatus.IN_USE:
        return AssetStatus.IN_USE;
      case MachineStatus.MAINTENANCE:
        return AssetStatus.MAINTENANCE;
      case MachineStatus.RETIRED:
        return AssetStatus.RETIRED;
      default:
        return AssetStatus.AVAILABLE;
    }
  }

  for (const m of allMachines) {
    const existing = await prisma.asset.findUnique({ where: { machineId: m.id } });
    if (!existing) {
      await prisma.asset.create({
        data: {
          labId: makerspace.id,
          name: m.name,
          kind: AssetKind.MACHINE,
          status: machineStatusToAssetStatus(m.status),
          location: m.location,
          machineId: m.id,
        },
      });
    }
  }
  console.log(`  Asset rows created for ${allMachines.length} machines`);

  // ─── InventoryItem rows for each Material (idempotent via materialId unique) ──
  const allMaterials = await prisma.material.findMany({ where: { labId: makerspace.id } });

  for (const mat of allMaterials) {
    const existing = await prisma.inventoryItem.findUnique({ where: { materialId: mat.id } });
    if (!existing) {
      await prisma.inventoryItem.create({
        data: {
          labId: makerspace.id,
          name: mat.name,
          qtyOnHand: Math.round(mat.currentStock),
          reorderLevel: Math.round(mat.lowStockThreshold),
          materialId: mat.id,
        },
      });
    }
  }
  console.log(`  InventoryItem rows created for ${allMaterials.length} materials`);

  // ─── Robotics-only Assets (mechanical tools) ─────────────
  const roboticsAssetNames = ["Caliper Set", "Allen Key Set", "Bench Vise", "Drill Press"];
  for (const name of roboticsAssetNames) {
    const existing = await prisma.asset.findFirst({
      where: { name, labId: robotics.id },
    });
    if (!existing) {
      await prisma.asset.create({
        data: {
          labId: robotics.id,
          divisionId: divMechanical.id,
          name,
          kind: AssetKind.TOOL,
          status: AssetStatus.AVAILABLE,
        },
      });
    }
  }
  console.log("  Robotics mechanical assets created");

  // ─── Robotics-only InventoryItems (electronics) ──────────
  const roboticsItems: Array<{ name: string; qty: number }> = [
    { name: "Arduino Uno R3", qty: 12 },
    { name: "ESP32 DevKit", qty: 8 },
    { name: "10k Resistor (100-pack)", qty: 30 },
    { name: "Jumper Wire Pack", qty: 25 },
    { name: "LiPo Battery 11.1V 2200mAh", qty: 4 },
  ];

  for (const item of roboticsItems) {
    const existing = await prisma.inventoryItem.findFirst({
      where: { name: item.name, labId: robotics.id },
    });
    if (!existing) {
      await prisma.inventoryItem.create({
        data: {
          labId: robotics.id,
          divisionId: divElectronics.id,
          name: item.name,
          qtyOnHand: item.qty,
          reorderLevel: 5,
        },
      });
    }
  }
  console.log("  Robotics electronics inventory items created");

  // ─── ProcurementRequests (3 rows, spread across next 14 days) ──
  const now = new Date();
  const day5 = new Date(now);
  day5.setDate(now.getDate() + 5);
  const day10 = new Date(now);
  day10.setDate(now.getDate() + 10);
  const day14 = new Date(now);
  day14.setDate(now.getDate() + 14);

  const procurementSeeds: Array<{
    labId: string;
    requestedById: string;
    itemName: string;
    quantity: number;
    vendor: string;
    expectedArrival: Date;
    status: ProcurementStatus;
    notes: string;
  }> = [
    {
      labId: makerspace.id,
      requestedById: admin.id,
      itemName: "PLA Filament (White) 5kg",
      quantity: 5,
      vendor: "Sculpteo Supplies",
      expectedArrival: day5,
      status: ProcurementStatus.NEW,
      notes: "Stock running low; needed before end-of-month projects.",
    },
    {
      labId: robotics.id,
      requestedById: mentor1.id,
      itemName: "LiPo Battery 11.1V 2200mAh (x10)",
      quantity: 10,
      vendor: "RobotShop India",
      expectedArrival: day10,
      status: ProcurementStatus.APPROVED,
      notes: "For drone competition team batteries.",
    },
    {
      labId: robotics.id,
      requestedById: mentor2.id,
      itemName: "Arduino Mega 2560 (x5)",
      quantity: 5,
      vendor: "RoboElements",
      expectedArrival: day14,
      status: ProcurementStatus.ORDERED,
      notes: "Required for autonomous navigation modules.",
    },
  ];

  for (const pr of procurementSeeds) {
    const existing = await prisma.procurementRequest.findFirst({
      where: { labId: pr.labId, itemName: pr.itemName },
    });
    if (!existing) {
      await prisma.procurementRequest.create({ data: pr });
    }
  }
  console.log("  Procurement requests created");

  console.log("\nSeed complete!");
  console.log("\n  Demo accounts:");
  console.log("  Admin:   admin@plaksha.edu.in");
  console.log("  Mentor:  rajesh.kumar@plaksha.edu.in");
  console.log("  Mentor:  priya.sharma@plaksha.edu.in");
  console.log("  Student: arjun.patel@plaksha.edu.in");
  console.log("  Student: sneha.reddy@plaksha.edu.in");
  console.log("  Student: vikram.singh@plaksha.edu.in");
  console.log("  Student: ananya.gupta@plaksha.edu.in");
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
