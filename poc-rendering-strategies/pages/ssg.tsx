import Post from "../components/Post";
import { fetchPost } from "../lib/fetchPost";

export const getStaticProps = async () => {
  const post = await fetchPost();
  console.log("[SSG] Generating static HTML at build time...");
  return { props: { post } };
};

export default function SSG({ post }) {
  return <Post title="SSG - Static Site Generation" post={post} />;
}
