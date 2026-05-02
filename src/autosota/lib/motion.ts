export const springPresets = {
  gentle: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
  },
  default: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },
  wobbly: {
    type: "spring" as const,
    stiffness: 100,
    damping: 10,
  },
  bounce: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10,
  },
  slow: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  },
};