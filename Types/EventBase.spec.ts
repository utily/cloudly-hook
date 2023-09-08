import { isly } from "isly"
import { EventBase } from "./EventBase"

type testBody = { test: number }
type Test = EventBase<"test">
const testType = EventBase.type.extend<Test>({
	hook: isly.string("test"),
	body: isly.object<testBody>({ test: isly.number() }),
})

describe("EventBase", () => {
	it("Event", () => {
		expect(
			testType.is({
				hook: "test",
				url: "https://www.example.com",
				body: { test: 1 },
				options: { maxRetries: 5, timeFactor: 5 },
				retries: 0,
				index: 0,
			})
		).toBe(true)
	})
	it("Not event", () => {
		expect(
			testType.is({
				hook: "test",
				url: "http://www.example.com",
				body: { test: 1 },
				options: { maxRetries: 5, timeFactor: 5 },
				retries: 0,
				index: 0,
			})
		).toBe(false)
		expect(
			testType.is({
				hook: "test",
				url: "https://www.example.com",
				body: { test: "1" },
				options: { maxRetries: 5, timeFactor: 5 },
				retries: 0,
				index: 0,
			})
		).toBe(false)
		expect(
			testType.is({
				hook: "test",
				url: "https://www.example.com",
				buddy: { test: 1 },
				options: { maxRetries: 5, timeFactor: 5 },
				retries: 0,
				index: 0,
			})
		).toBe(false)
	})
})
