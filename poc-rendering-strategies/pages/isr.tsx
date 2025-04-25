import Post from "../components/Post";
import { fetchPost } from "../lib/fetchPost";

export const getStaticProps = async () => {
  const post = await fetchPost();
  console.log("[ISR] Generating static HTML with revalidation...");
  return {
    props: { post },
    revalidate: 10,
  };
};

export default function ISR({ post }) {
  return <Post title="ISR - Incremental Static Generation" post={post} />;
}
