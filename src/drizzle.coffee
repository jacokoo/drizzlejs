define [
    './core/application'
    './core/module'
    './core/loader'
    './core/region'
    './core/view'
], (Application, Module, Loader, Region, View) ->

    Drizzle =
        Application: Application
        Module: Module
        Loader: Loader
        Region: Region
        View: View

    Drizzle
