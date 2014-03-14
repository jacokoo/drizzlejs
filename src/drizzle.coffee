define [
    './core/application'
    './core/module'
    './core/loader'
    './core/region'
    './core/view'
    './core/multi-region'
], (Application, Module, Loader, Region, View, MultiRegion) ->

    Drizzle =
        Application: Application
        Module: Module
        Loader: Loader
        Region: Region
        View: View
        MultiRegion: MultiRegion

    Drizzle
