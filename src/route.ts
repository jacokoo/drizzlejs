interface RouteOptions {
    ref?: string
    region?: string
    action?: string
    update? (...args: string[]): void
    leave? (): boolean
    enter? (): boolean
}
