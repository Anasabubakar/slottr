import { z } from "zod";

import prisma from "@calcom/prisma";

const computeInstallCountsFromDB = async (): Promise<Record<string, number>> => {
  const mostPopularApps = z.array(z.object({ appId: z.string(), installCount: z.number() })).parse(
    await prisma.$queryRaw`
    SELECT
      c."appId",
      COUNT(*)::integer AS "installCount"
    FROM
      "Credential" c
    WHERE
      c."appId" IS NOT NULL
    GROUP BY
      c."appId"
    ORDER BY
      "installCount" DESC
    `
  );
  return mostPopularApps.reduce(
    (acc, { appId, installCount }) => {
      acc[appId] = installCount;
      return acc;
    },
    {} as Record<string, number>
  );
};

const getInstallCountPerApp = async (): Promise<Record<string, number>> => {
  // unstable_cache from next/cache requires an App Router incremental-cache context,
  // but this is also reached from Pages Router API routes (pages/api/trpc/apps/[trpc].ts),
  // where it throws "incrementalCache missing". Compute directly instead.
  return computeInstallCountsFromDB();
};

export default getInstallCountPerApp;
export { computeInstallCountsFromDB };
