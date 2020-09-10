import * as d3 from "d3";
import React from 'react';

function Heatmap() {

    const d3 = require("d3");

    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.send();
    req.onload = () => {
        const json = JSON.parse(req.responseText);
        const dataset = json.monthlyVariance;
        const base = json.baseTemperature;
        // console.log(dataset.baseTemperature); 
        // data loading ---- request success

        // svg width, height and padding
        var w = 800;
        const h = 500;
        const pad = 70;

        // console.log(dataset.length) //3153
        const cellWidth = w / Math.ceil(dataset.length / 20);
        const cellHeight = (h - pad) / 12;
        const colors = [['tomato', '< 7'], ['orange', '7-8'], ['gold', '8-9'], ['red', '> 9']];

        const year = d3.extent(dataset.map(d => d.year));
        const minYear = year[0];
        const maxYear = year[1];

        const month = d3.extent(dataset.map(d => d.month))
        // const minMonth = month[0];
        // const maxMonth = month[1];
        const january = new Date('1970-1-1');
        const december = new Date('1970-12-1');

        const variance = d3.extent(dataset.map(d => d.variance));
        const minVariance = variance[0];
        const maxVariance = variance[1];


        const svg = d3.select('div#heatmap').append('svg')
            .attr('width', w)
            .attr('height', h)
            .style('background-color', 'silver')

        const xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([pad, w - pad])

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.format('d'));


        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', 'translate(0, ' + (h - pad) + ')')
            .call(xAxis);

        const yScale = d3.scaleTime()
            .domain([january, december])
            .range([pad, (h - pad - h / 12 + 8)]);

        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat('%B'));

        svg.append('g')
            .attr('id', 'y-axis')
            .attr('transform', 'translate(' + pad + ',0)')
            .call(yAxis);

        // title
        svg.append('text')
            .attr('id', 'title')
            .text(`Global Heat Map (${minYear} to ${maxYear})`)
            .attr('x', w / 3)
            .attr('y', 30)
            .style('font-size', '1.5rem');

        // desctiption
        svg.append('text')
            .attr('id', 'description')
            .text(`Land Surface Temperature, Base Temperature ${base}`)
            .attr('x', w / 3 - 5)
            .attr('y', 50);

        // declare tooltip
        const tooltip = d3.select('#heatmap')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);

        // data presentaton 
        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('class', 'cell')
            .attr('width', cellWidth)
            .attr('height', cellHeight)
            .attr('fill', d => d.variance + base < 7 ? 'tomato' : d.variance + base < 8 ? 'orange' : d.variance + base < 9 ? 'gold' : 'red')
            .attr('x', (d, i) => xScale(d.year))
            .attr('y', (d, i) => yScale(new Date(`1970-${d.month}-1`)))
            .attr('data-month', d => d.month - 1)
            .attr('data-year', d => d.year)
            .attr('data-temp', d => d.variance)
            .on('mouseover', (d, i) => {
                tooltip.style('opacity', 1)
                    .style('left', (d3.event.pageX + 10) + 'px')
                    .style('top', (d3.event.pageY - 20) + 'px')
                    .attr('data-year', d.year)
                    .html(`${d3.timeFormat('%B')(new Date(1970, d.month - 1))}, ${d.year} <br/>${(d.variance + base).toFixed(3)}°C <br/>Variance: ${d.variance}`)

            })
            .on('mouseout', (d, i) => {
                tooltip.style('opacity', 0)
                    .style('left', 0)
                    .style('top', 0);
            });


        //legend
        svg.append('g')
            .attr('id', 'legend')
            .selectAll('rect')
            .data(colors)
            .enter()
            .append('rect')
            .attr('width', 30)
            .attr('height', 30)
            .attr('x', (d, i) => pad + i * 150)
            .attr('y', h - 50)
            .style('fill', (d, i) => colors[i][0]);

        svg.append('g')
            .selectAll('text')
            .data(colors)
            .enter()
            .append('text')
            .text((d, i) => colors[i][1])
            .attr('x', (d, i) => pad * 1.5 + i * 150)
            .attr('y', h - 30);
    }

    return (
        <div id="mainapp" className="container">
            <div id='heatmap'>
            </div>
        </div>
    )
};

export default Heatmap;
