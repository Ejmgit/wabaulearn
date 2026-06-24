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

      review[]->{
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

// Fetch a single post by its _id (used by the [id] detail page)
export async function getPostById(id) {
  if (!id) {
    console.log("Missing post id");
    return null;
  }

  return client.fetch(
    `
    *[_type == "post" && _id == $id][0]{
      _id,
      title,
      mainImage,

      author->{
        name,
        image,
        bio
      },

      review[]->{
        title,
      },

      categories[]->{
        title
      },

      publishedAt,
      body
    }
    `,
    { id },
  );
}
