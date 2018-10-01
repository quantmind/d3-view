import { viewProviders, viewTemplate } from "../index";
import "./utils";

describe("templates", () => {
  const compileTemplate = viewProviders.compileTemplate,
    logger = viewProviders.logger;

  beforeEach(() => {
    viewProviders.compileTemplate = null;
  });

  afterEach(() => {
    viewProviders.compileTemplate = compileTemplate;
  });

  test("warning", () => {
    logger.pop();
    expect(viewTemplate("test", {})).toBe("test");
    let logs = logger.pop();
    expect(logs.length).toBe(1);
  });
});
