export type LabSlug = "makerspace" | "robotics";

export type LabDivision = {
  slug: string;
  name: string;
  description: string;
};

export type LabHours = {
  day: string;
  open: string;
  close: string;
};

export interface PlaceholderLab {
  slug: LabSlug;
  name: string;
  tagline: string;
  description: string;
  location: string;
  contactEmail: string;
  hours: LabHours[];
  divisions: LabDivision[];
  highlights: string[];
  heroImage?: string;
}

export const PLACEHOLDER_LABS: PlaceholderLab[] = [
  {
    slug: "makerspace",
    name: "Plaksha Makerspace",
    tagline: "Where ideas become physical reality.",
    description:
      "The Plaksha Makerspace is a full-spectrum fabrication facility for students and researchers. Browse a curated machine catalog, book mentor-guided sessions, manage Bill of Materials workflows for your team, and publish your completed projects to the public showcase. From laser cutters to 3D printers, every tool is one booking away.",
    location: "Academic Block B, Ground Floor, Room B-001",
    contactEmail: "makerspace@plaksha.edu.in",
    hours: [
      { day: "Monday", open: "09:00", close: "20:00" },
      { day: "Tuesday", open: "09:00", close: "20:00" },
      { day: "Wednesday", open: "09:00", close: "20:00" },
      { day: "Thursday", open: "09:00", close: "20:00" },
      { day: "Friday", open: "09:00", close: "18:00" },
      { day: "Saturday", open: "10:00", close: "16:00" },
      { day: "Sunday", open: "Closed", close: "Closed" },
    ],
    divisions: [],
    highlights: [
      "Machine catalog with 30+ tools — from FDM printers to CNC routers",
      "Mentor booking system with real-time availability slots",
      "Structured BOM workflows with multi-level approval chains",
      "Public project showcase for completed team builds",
      "Training certifications required before operating high-risk equipment",
    ],
  },
  {
    slug: "robotics",
    name: "Plaksha Robotics Lab",
    tagline: "Autonomous systems, built here.",
    description:
      "The Plaksha Robotics Lab supports end-to-end development of autonomous and semi-autonomous systems. Mechanical and Electronics divisions share a unified component inventory and procurement pipeline, so your team can check out tools, track consumables, and raise purchase requests without crossing corridors. Build robots that work.",
    location: "Engineering Block A, First Floor, Room A-112",
    contactEmail: "robotics-lab@plaksha.edu.in",
    hours: [
      { day: "Monday", open: "08:00", close: "22:00" },
      { day: "Tuesday", open: "08:00", close: "22:00" },
      { day: "Wednesday", open: "08:00", close: "22:00" },
      { day: "Thursday", open: "08:00", close: "22:00" },
      { day: "Friday", open: "08:00", close: "20:00" },
      { day: "Saturday", open: "09:00", close: "18:00" },
      { day: "Sunday", open: "10:00", close: "15:00" },
    ],
    divisions: [
      {
        slug: "mechanical",
        name: "Mechanical Division",
        description:
          "Handles structural design, fabrication, and testing of robot chassis, actuator mounts, and drive systems. Houses lathes, mills, welding stations, and a dedicated CAD workstation cluster.",
      },
      {
        slug: "electronics",
        name: "Electronics Division",
        description:
          "Covers PCB design, embedded systems, sensor integration, and power electronics. Equipped with oscilloscopes, soldering stations, logic analyzers, and a component library of 5,000+ SKUs.",
      },
    ],
    highlights: [
      "Tool checkout system with real-time availability and condition tracking",
      "Component inventory with 5,000+ electronic and mechanical SKUs",
      "Integrated procurement workflow for bulk and specialty orders",
      "Separate Mechanical and Electronics divisions with shared governance",
      "Project-linked inventory allocation to prevent cross-team conflicts",
    ],
  },
];
