import { client } from "./client";

export async function getPostData() {
  return await client.fetch(`
    *[_type == "post"]{
      _id,
      title,
      mainImage,

      author->{
        name,
        image,
        bio
      },

      review->{
        title,
      },

      categories[]->{
        title,
      },

      publishedAt,
      body
    }
  `);
}
