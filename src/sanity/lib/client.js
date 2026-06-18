import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, authtoken } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  authtoken,
  useCdn: false,
});
