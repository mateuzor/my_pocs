import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import AccessibleApp from "../App";

expect.extend(toHaveNoViolations);

test("should have no accessibility violations", async () => {
  const { container } = render(<AccessibleApp />);
  const results = await axe(container, cus);
  expect(results).toHaveNoViolations();
});
