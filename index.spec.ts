import "jest"
import * as library from "./index"

describe("library", () => {
	it("a", () => {
		expect(library.a).toEqual(42)
	})
})
