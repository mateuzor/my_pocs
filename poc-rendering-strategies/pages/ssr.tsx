import Post from "../components/Post";
import { fetchPost } from "../lib/fetchPost";

export const getServerSideProps = async () => {
  const post = await fetchPost();
  console.log("[SSR] Generating HTML on every request...");
  return { props: { post } };
};

export default function SSR({ post }) {
  return <Post title="SSR" post={post} />;
}
