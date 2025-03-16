import { multiSessionClient, organizationClient, passkeyClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export type AuthClient = Omit<ReturnType<typeof createAuthClient>, "signUp">

const passkeyAuthClient = createAuthClient({ plugins: [passkeyClient()] })
export type PasskeyAuthClient = typeof passkeyAuthClient

const multiSessionAuthClient = createAuthClient({
    plugins: [multiSessionClient(), organizationClient()]
})
export type MultiSessionAuthClient = typeof multiSessionAuthClient

const organizationAuthClient = createAuthClient({
    plugins: [organizationClient()]
})

export type OrganizationAuthClient = typeof organizationAuthClient
