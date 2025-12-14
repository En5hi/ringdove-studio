type DribbbleShot = {
  id: number;
  title: string;
  html_url: string;
  images: { hidpi?: string; normal: string; teaser: string };
};

const DRIBBBLE_TOKEN = process.env.DRIBBBLE_TOKEN;

export const fetchDribbbleShots = async (): Promise<DribbbleShot[] | null> => {
  if (!DRIBBBLE_TOKEN) return null;

  try {
    const res = await fetch("https://api.dribbble.com/v2/user/shots?per_page=6", {
      headers: {
        Authorization: `Bearer ${DRIBBBLE_TOKEN}`
      },
      next: { revalidate: 60 * 30 }
    });

    if (!res.ok) return null;
    return (await res.json()) as DribbbleShot[];
  } catch {
    return null;
  }
};
