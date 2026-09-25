import { z } from "zod";

export const configSchema = z.object({
  status: z.object({
    enabled: z.boolean(),
    message: z.string(),
  }),
  business: z.object({
    name: z.string().min(1),
    tagline: z.string(),
    phone: z.string(),
    textNumber: z.string(),
    email: z.string(),
    facebookUrl: z.string(),
    serviceArea: z.string(),
  }),
  services: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        included: z.array(z.string()),
      }),
    )
    .min(1),
  testimonials: z.array(
    z.object({
      quote: z.string(),
      name: z.string(),
    }),
  ),
  admin: z.object({
    githubEditUrl: z.string(),
  }),
});

export type SiteConfig = z.infer<typeof configSchema>;

export const defaultConfig: SiteConfig = {
  status: {
    enabled: false,
    message: "",
  },
  business: {
    name: "NeatBliss Cleaning",
    tagline: "Come home to a little bliss.",
    phone: "[PHONE NUMBER]",
    textNumber: "[TEXT NUMBER]",
    email: "[EMAIL ADDRESS]",
    facebookUrl: "[FACEBOOK PAGE URL]",
    serviceArea: "[CITY] and nearby areas",
  },
  services: [
    {
      title: "Recurring cleans",
      description:
        "Weekly, biweekly, or monthly cleans to keep your home feeling fresh without you thinking about it.",
      included: [
        "Kitchens, bathrooms, bedrooms, and living areas",
        "Dusting, vacuuming, and mopping",
        "Trash out and surfaces wiped down",
      ],
    },
    {
      title: "Deep cleans",
      description:
        "A top to bottom reset for a home that needs extra attention, or a great starting point before recurring service.",
      included: [
        "Everything in a standard clean",
        "Baseboards, doors, and light fixtures",
        "Inside the microwave and behind small appliances",
      ],
    },
    {
      title: "Move in or move out cleans",
      description:
        "Getting a place ready for the next chapter, whether you are moving in fresh or handing keys back.",
      included: [
        "Inside cabinets, drawers, and the oven",
        "Inside the fridge and freezer",
        "Every surface reset for the next family",
      ],
    },
  ],
  testimonials: [
    {
      quote:
        "[Paste a real Facebook review here. It should feel like a neighbor talking about their experience.]",
      name: "[Client first name and last initial]",
    },
    {
      quote:
        "[Another review, ideally about a different service so visitors see the range of what you do.]",
      name: "[Client first name and last initial]",
    },
    {
      quote:
        "[One more review, kept short and warm. Copy word for word from your Facebook page.]",
      name: "[Client first name and last initial]",
    },
  ],
  admin: {
    githubEditUrl: "[GITHUB EDIT URL FOR public/config.json]",
  },
};
