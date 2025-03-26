"use client"

import { useCallback, useContext, useEffect, useState } from "react"

import { ChevronsUpDown } from "lucide-react"
import { cn } from "@repo/design-system/lib/utils"
import type { OrganizationAuthClient } from "@repo/auth/types/auth-client"
import type { Organization } from "@repo/auth/types/organization"
import { OrganizationAvatar, type OrganizationAvatarClassNames } from "@repo/auth/components/organization-avatar"
import { Button } from "@repo/design-system/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@repo/design-system/components/ui/dropdown-menu"
import { Skeleton } from "@repo/design-system/components/ui/skeleton"
import { AuthUIContext, UserAvatar } from "@daveyplate/better-auth-ui"
import { User } from "better-auth"
import { useRouter } from "next/navigation"

// Types
type SwitcherClassNames = {
    skeleton?: string
    base?: string
    trigger?: {
        base?: string
        avatar?: OrganizationAvatarClassNames
        skeleton?: string
    }
    content?: {
        base?: string
        avatar?: OrganizationAvatarClassNames
        separator?: string
    }
}

type SwitcherProps = {
    localization?: {}
    size?: "icon" | "full"
    classNames?: SwitcherClassNames
    className?: string
}

// Container component that handles data fetching and state
const OrganizationSwitcherContainer = (props: SwitcherProps) => {
    let { localization, ...rest } = props
    const context = useContext(AuthUIContext)
    const { hooks, localization: authLocalization } = context
    localization = { ...authLocalization, ...localization }
    const authClient = context.authClient as OrganizationAuthClient
    const router = useRouter()
    if (!authClient.organization) {
        throw new Error(
            "Organization auth client not found. Did you forget to add the organization plugin?"
        )
    }

    
    const [userMode, setUserMode] = useState(false)
    
    const { data: organizations, isPending: isOrganizationsPending } =
    authClient.useListOrganizations()
    const { data: sessionData, isPending: sessionPending, refetch: refetchSession } = authClient.useSession()
    const {data:activeOrganization} = authClient.useActiveOrganization()
    const user = sessionData?.user as User
    const isPending = sessionPending || isOrganizationsPending

      useEffect(() => {
          setUserMode(!activeOrganization)
      }, [activeOrganization])

    const setOrganization = useCallback(
        (organizationId: string) => {
            authClient.organization.setActive({ organizationId })
            refetchSession()
            router.refresh()
        },
        [authClient, refetchSession]
    )

    // If loading, show loading state
    if (isPending) {
        return <OrganizationSwitcherLoading {...props} />
    }

    const handleUserMode = () => {
        setUserMode(true)
        authClient.organization.setActive({ organizationId: null })
        refetchSession()
    }

    // Otherwise, render the actual component with all data provided as props
    return (
        <OrganizationSwitcherPresentation
            {...props}
            user={user}
            userMode={userMode}
            organizations={organizations || []}
            activeOrganization={activeOrganization as Organization}
            onSelectOrganization={setOrganization}
            onSelectUserMode={handleUserMode}
            localization={localization}
        />
    )
}

const OrganizationSwitcherPresentation = ({
    localization,
    size = "icon",
    classNames,
    className,
    user,
    userMode,
    organizations,
    activeOrganization,
    onSelectOrganization,
    onSelectUserMode,
    onOrganizationChange
}: SwitcherProps & {
    user: User | undefined
    userMode: boolean
    organizations: Organization[]
    activeOrganization: Organization | null
    onSelectOrganization: (id: string) => void
    onSelectUserMode: () => void
    onOrganizationChange?: (id: string | null) => void | Promise<void>
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className={cn(size === "icon" && "rounded-full", classNames?.trigger?.base)}
                asChild={size !== "icon"}
            >
                {size === "icon" ? (
                    // Icon size
                    userMode ? (
                        <UserAvatar
                            className={cn("size-8", className, classNames?.base)}
                            classNames={classNames?.trigger?.avatar}
                            user={user}
                        />
                    ) : (
                        <OrganizationAvatar
                            className={cn("size-8", className, classNames?.base)}
                            classNames={classNames?.trigger?.avatar}
                            organization={activeOrganization}
                        />
                    )
                ) : (
                    // Full size
                    <Button className={cn("!px-3 h-12", className)} variant="outline">
                        {userMode ? (
                            <UserCard user={user!} />
                        ) : (
                            <OrganizationCard
                                organization={activeOrganization!}
                                classNames={classNames}
                            />
                        )}

                        <ChevronsUpDown className="ml-auto size-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className={cn(
                    "me-3 max-w-64",
                    size === "full" && "min-w-48",
                    classNames?.content?.base
                )}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {/* Header */}
                {userMode ? (
                    <UserCard user={user!} />
                ) : (
                    <OrganizationCard organization={activeOrganization!} classNames={classNames} />
                )}

                <DropdownMenuSeparator className={classNames?.content?.separator} />

                {/* Organization list */}
                {organizations
                    .filter((o) => o.id !== activeOrganization?.id)
                    .map((organization) => (
                        <DropdownMenuItem
                            key={organization.id}
                            onClick={() => {
                                onSelectOrganization(organization.id)
                                onOrganizationChange?.(organization.id)
                            }}
                        >
                            <OrganizationCard organization={organization} classNames={classNames} />
                        </DropdownMenuItem>
                    ))}

                {/* User mode button */}
                {!userMode && (
                    <>
                        <DropdownMenuSeparator className={classNames?.content?.separator} />
                        <DropdownMenuItem
                            key="user-mode"
                            onClick={() => {
                                onSelectUserMode()
                                onOrganizationChange?.(null)
                            }}
                        >
                            <UserCard user={user!} />
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

// Public API - only expose the container component
export const OrganizationButton = OrganizationSwitcherContainer

const UserCard = ({ user }: { user: User }) => {
    return (
        <div className="flex items-center gap-2 text-sm">
            <UserAvatar />
            <div className="flex grow flex-col truncate text-left">
                <div className="truncate font-medium text-sm">{user?.name}</div>
                <div className="!font-light truncate text-muted-foreground text-xs">
                    User mode
                </div>
            </div>
        </div>
    )
}

const OrganizationCard = ({
    organization,
    classNames
}: { organization: Organization; classNames?: SwitcherClassNames }) => {
    return (
        <div className="flex items-center gap-2">
            <OrganizationAvatar
                classNames={classNames?.content?.avatar}
                organization={organization}
            />
            <div className="flex flex-col truncate">
                <div className="truncate font-medium text-sm">{organization.name}</div>
            </div>
        </div>
    )
}

// Loading state component
const OrganizationSwitcherLoading = ({ size = "icon", classNames, className }: SwitcherProps) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild={size === "full"}
                className={cn(size === "icon" && "rounded-full", classNames?.trigger?.base)}
                disabled={true}
            >
                {size === "icon" ? (
                    <Skeleton
                        className={cn(
                            "size-8 rounded-full",
                            className,
                            classNames?.base,
                            classNames?.skeleton,
                            classNames?.trigger?.skeleton
                        )}
                    />
                ) : (
                    <Button className={cn("!px-3 h-12", className)} variant="outline">
                        <Skeleton className={cn("size-8 rounded-full", classNames?.skeleton)} />
                        <div className="flex grow flex-col truncate text-left">
                            <Skeleton className={cn("h-3 w-20", classNames?.skeleton)} />
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={cn(
                    "me-3 max-w-64",
                    size === "full" && "min-w-48",
                    classNames?.content?.base
                )}
            >
                <div className="flex items-center gap-2 p-2">
                    <Skeleton className={cn("size-8 rounded-full", classNames?.skeleton)} />
                    <div className="flex flex-col truncate">
                        <Skeleton className={cn("h-3 w-20", classNames?.skeleton)} />
                    </div>
                </div>
                <DropdownMenuSeparator className={classNames?.content?.separator} />
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 p-2">
                        <Skeleton className={cn("size-8 rounded-full", classNames?.skeleton)} />
                        <Skeleton className={cn("h-3 w-24", classNames?.skeleton)} />
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
