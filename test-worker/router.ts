import { Router } from "cloudly-router"
import { Context } from "./Context"

export const router = new Router<Context>({ catch: true })
