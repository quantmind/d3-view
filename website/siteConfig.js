

module.exports = {
    title: "d3-view - d3 plugin for building interactive data-driven web interfaces",
    baseUrl: "https://d3-view.giottojs.org",
    github: "quantmind/d3-view",
    algolia: {
        apiKey: process.env.ALGOLIA_API_KEY
    },
    markdown: {
        paths: [
            {
                meta: {
                    slug: "docs",
                    path: "docs",
                    template: "sidenav",
                    title: "Documentation",
                    highlightTheme: "androidstudio"
                },
                sidenav: {
                    sidebarToggle: "<icon data-src='https://fluidily-public.s3.amazonaws.com/d3-view/images/d3view.svg'></icon>",
                    primaryItems: [
                        {
                            name: "Overview",
                            icon: "file-text",
                            items: [
                                {
                                    name: "Getting started",
                                    href: "/docs/getting-started"
                                },
                                {
                                    name: "Examples",
                                    href: "/docs/examples"
                                },
                                {
                                    name: "Development",
                                    href: "/docs/develop"
                                }
                            ]
                        },
                        {
                            name: "API",
                            icon: "package",
                            items: [
                                {
                                    name: "Reactive model",
                                    href: "/docs/model"
                                },
                                {
                                    name: "Base prototype",
                                    href: "/docs/base"
                                },
                                {
                                    name: "Components",
                                    href: "/docs/component"
                                },
                                {
                                    name: "Directives",
                                    href: "/docs/directives"
                                },
                                {
                                    name: "Expressions",
                                    href: "/docs/expressions"
                                },
                                {
                                    name: "Tools",
                                    href: "/docs/tools"
                                }
                            ]
                        },
                        {
                            name: "Extending",
                            items: [
                                {
                                    name: "Plugins",
                                    href: "/docs/plugins"
                                },
                                {
                                    name: "Providers",
                                    href: "/docs/providers"
                                },
                                {
                                    name: "Forms",
                                    href: "/docs/forms"
                                }
                            ]
                        },
                        {
                            name: "Addons",
                            items: [
                                {
                                    name: "View require",
                                    href: "/docs/require"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                meta: {
                    slug: "",
                    path: "site",
                    template: "topnav"
                },
                topnav: {
                    navigationRight: [
                        {
                            href: "/docs",
                            name: "docs"
                        }
                    ]
                }
            }
        ],
        plugins: {
        }
    }
};
