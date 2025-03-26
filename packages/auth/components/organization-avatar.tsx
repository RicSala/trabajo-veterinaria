import { UserIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { cn } from "@repo/design-system/lib/utils"

import type { Organization } from "@repo/auth/types/organization"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design-system/components/ui/avatar"

export interface OrganizationAvatarClassNames {
    base?: string
    image?: string
    fallback?: string
    fallbackIcon?: string
}

export interface OrganizationAvatarProps {
    organization: Organization | null
    classNames?: OrganizationAvatarClassNames
}

export function OrganizationAvatar({
    organization,
    classNames,
    className,
    ...props
}: OrganizationAvatarProps & ComponentProps<typeof Avatar>) {
    const name = organization?.name
    const src = organization?.logo as string

    return (
        <Avatar key={src} className={cn(className, classNames?.base)} {...props}>
            <AvatarImage
                alt={name || "Avatar"}
                className={classNames?.image}
                src={organization?.logo ? (organization.logo as string) : undefined}
            />

            <AvatarFallback
                className={cn("uppercase", classNames?.fallback)}
                delayMs={src ? 200 : 0}
            >
                {firstTwoCharacters(name) || (
                    <UserIcon className={cn("w-[55%]", classNames?.fallbackIcon)} />
                )}
            </AvatarFallback>
        </Avatar>
    )
}

const firstTwoCharacters = (name?: string | null) => name?.slice(0, 2)
