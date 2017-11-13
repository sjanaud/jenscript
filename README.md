# Jenscript

<a href="https://jenscript.io"><img width="180" height="180" src="https://jenscript.io/svg/jenscript.svg"  align="left"></a>
**Jenscript** is a JavaScript HTML5/SVG library for visualization and charting in web modern browsers. Jenscript provides most of commons charts
like pie, donuts, lines, spline, scatter, stocks, bar symbols, gantt, ray, metrics and tools like zoom, pan, widgets and projections selectors.
Jenscript is available as a standalone file or a set of plugin libraries.

Learn more ? [Jenscript](https://jenscript.io)  
  
    
<br><br>

## Links

* [Site](https://jenscript.io)
* [Resources](https://jenscript.io/jenscript/charts/samples/)

## Installing

node package manager, `npm install jenscript`. Otherwise, see [releases](https://github.com/sjanaud/jenscript/releases).


from jenscript.io website

```html
<script src="https://jenscript.io/jenscript.js"></script>
```

minified version:

```html
<script src="https://jenscript.io/jenscript.min.js"></script>
```

standalone jenscript plugins. For example, [donut3d](https://github.com/sjanaud/jenscript/tree/master/src/plugins/donut3d):

```html
<script src="https://jenscript.io/plugin/jenscript-core.min.js"></script>
<script src="https://jenscript.io/plugin/jenscript-donut3d.min.js"></script>
```

## View tree model

```
dom--
    |
    |--view--
            |
            |--projection-.
            |             |--plugin
            |             |--plugin
            |             |--plugin-.
            |                       |-- widget
            |                       |-- widget
            |--projection-.
                          |--plugin-.
                          |         |_ widget
                          |--plugin
                          |--plugin-.
                                    |
                                    |-- widget
                          
```          

