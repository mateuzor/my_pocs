import { FadeIn } from "../fadeIn";

export default function ExampleComponent() {
  return (
    <div>
      <h2>Animation Example</h2>
      <FadeIn duration={1000}>
        <p>This text fades in smoothly.</p>
      </FadeIn>
    </div>
  );
}
