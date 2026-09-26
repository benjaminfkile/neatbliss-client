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
      title: "Recurring cleaning",
      description:
        "Weekly, every other week, or monthly. We keep your home consistently fresh so you never fall behind.",
      included: [
        "Dusting all surfaces",
        "Vacuum and mop all floors",
        "Kitchen counters, sink, and outside of appliances",
        "Bathrooms: toilets, tubs, showers, and mirrors",
        "Trash out and beds made",
      ],
    },
    {
      title: "Deep cleaning",
      description:
        "A top to bottom reset. Baseboards, fixtures, appliances, and all the spots regular cleans miss.",
      included: [
        "Everything in a recurring clean",
        "Baseboards, door frames, and switch plates",
        "Light fixtures and ceiling fans",
        "Window sills and tracks",
        "Cabinet fronts and inside the microwave",
      ],
    },
    {
      title: "Move in and move out",
      description:
        "Empty home cleans that help you get your deposit back, or start fresh in a new place.",
      included: [
        "Everything in a deep clean",
        "Inside cabinets and drawers",
        "Inside the fridge and oven",
        "Closets and shelving wiped down",
        "Ready for the final walkthrough",
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
    githubEditUrl: "https://github.com/benjaminfkile/neatbliss-client/edit/main/public/config.json",
  },
};
