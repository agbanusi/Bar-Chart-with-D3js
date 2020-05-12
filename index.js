let url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let xml= new XMLHttpRequest()
xml.open('GET',url,true)
xml.send()
xml.onload=()=>{
    let json = JSON.parse(xml.responseText)
    let dataset=json.data
    let data_data=json.data.map((i)=>{
        let d= new Date(i[0])
        let arr=d.getFullYear()
      
        return arr
    })
    let data=json.data.map((i)=>{
        return new Date(i[0])
    })
    let data_date=[...new Set(data_data)];
    let data_gdp=json.data.map((i)=>i[1])
    //console.log(data_date)
    let tooltip = d3.select('.let').append('div').attr('id','tooltip')
    let padding=50;
    let h= 450;
    let w = 950;
    var max= new Date(d3.max(data));
    max.setMonth(max.getMonth() + 3);
    let yScale=d3.scaleLinear().domain([0,d3.max(data_gdp)]).range([h-padding,padding]);
    let hScale=d3.scaleLinear().domain([0,d3.max(data_gdp)]).range([0,h-padding*2]);
    const xScale= d3.scaleTime().domain([d3.min(data),max]).range([padding, w - padding])
    let xAxis=d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y'));
    let yAxis=d3.axisLeft(yScale);
    let svg= d3.select('.let').append('svg').attr('width',w).attr('height',h).attr('class','svg');
    svg.append('text').text('USA GDP across the years').attr('id','title').attr('x',(w-padding)/3).attr('y',padding)
    svg.selectAll('rect').data(dataset).enter()
    .append('rect').attr('x',(d,i)=>xScale(data[i])).attr('y',(d,i)=>yScale(d[1])).attr('width',3).attr('height',(d,i)=>hScale(d[1])).attr('class','bar').attr('data-date',(i)=>i[0]).attr('data-gdp',(i)=>i[1]).on('mouseover',(d,i)=>{
            tooltip.style('display','inline-block')
                    .attr('data-date',d[0])
                    .html("Date: "+d[0])
        })
        .on('mouseout',(d)=>{tooltip.style('display','none')})
    d3.select('.let').selectAll('rect').data(dataset).append('title').text((d)=>{
        let quarter
        if(d[0].slice(5,7)=='01'){
            quarter='first'
        }
        else if(d[0].slice(5,7)=='04'){
            quarter='second'
        }
        else if(d[0].slice(5,7)=='07'){
            quarter='third'
        }
        else if(d[0].slice(5,7)==10){
            quarter='fourth'
        }
        return '$'+d[1]+' billion \n The '+quarter+' quarter of the year '+d[0].slice(0,4)+'.'
        })
        
  svg.append('g').attr('transform','translate(0,'+(h-padding)+')').attr('id','x-axis').call(xAxis);
  svg.append('g').attr('transform','translate('+(padding)+',0)').attr('id','y-axis').call(yAxis);
  
}
