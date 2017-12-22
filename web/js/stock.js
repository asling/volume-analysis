var upColor = '#00da3c';
var downColor = '#ec0000';

const queryObj = getURLParams(window.location.href);
function random(){
    let p;
    if(Math.round(Math.random()) === 0){
        p = -1;
    }else{
        p = 1;
    }
    return p * Math.round(Math.random()*5);
}

function calculateMA(dayCount, data) {
    var result = [];
    for (var i = 0, len = data.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-');
            continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
            sum += parseFloat(data.values[i - j][1]);
        }
        result.push(+(sum / dayCount).toFixed(3));
    }
    // console.log(result);
    return result;
}

function splitData(oldData,rawData) {
    var categoryData = [];
    var values = [];
    var rocs = [];
    var volumes = [];
    for (var i = 0; i < rawData.length; i++) {
        if(rawData[i]){
            categoryData.push(rawData[i]['date']);
            values.push([rawData[i]['open'],rawData[i]['close'],rawData[i]['lowest'],rawData[i]['highest']]);
            rocs.push(rawData[i]['rocs']);
            volumes.push([rawData[i]['date'],rawData[i]['volumes'],rawData[i]['close'] >= rawData[i]['open'] ? 1 : -1 ]);
            // volumes.push(rawData[i]['volumes']);
        }
        
    }
    if(oldData){
        return {
            categoryData: [
                ...oldData.categoryData,
                ...categoryData,
                ],
            values:[
                ...oldData.values,
                ...values,
            ],
            rocs: [
                ...oldData.rocs,
                ...rocs,
            ],
            volumes: [
                ...oldData.volumes,
                ...volumes,
            ]
        };
    }else{
        return {
            categoryData,
            values,
            rocs,
            volumes,
        };
    }
    
}

function initChart(){
    return echarts.init(document.getElementById('main'));
}

function renderChart(myChart,data){
    console.log("data",data);
    var option = {
                backgroundColor: '#21202D',
                legend: {
                    data: ['日K','MA5', 'MA10', 'MA20', 'MA30','MA60'],
                    inactiveColor: '#777',
                    textStyle: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false,
                        type: 'cross',
                        lineStyle: {
                            color: '#376df4',
                            width: 2,
                            opacity: 1
                        }
                    }
                },
                visualMap: {
                    show: false,
                    seriesIndex: 1,
                    dimension: 2,
                    pieces: [{
                        value: 1,
                        color: downColor
                    }, {
                        value: -1,
                        color: upColor
                    }]
                },
                xAxis: [{
                    type: 'category',
                    data: data.categoryData,
                    boundaryGap : false,
                    axisLine: { lineStyle: { color: '#777' } },
                    min: 'dataMin',
                    max: 'dataMax',
                    axisPointer: {
                        show: true
                    }
                }, {
                    type: 'category',
                    gridIndex: 1,
                    data: data.categoryData,
                    scale: true,
                    boundaryGap : false,
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    axisLine: { lineStyle: { color: '#777' } },
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                },
                {
                    type: 'category',
                    gridIndex: 2,
                    data: data.categoryData,
                    scale: true,
                    boundaryGap : false,
                    splitLine: {show: false},
                    axisLabel: {show: false},
                    axisTick: {show: false},
                    axisLine: { lineStyle: { color: '#777' } },
                    splitNumber: 20,
                    min: 'dataMin',
                    max: 'dataMax',
                }
                ],
                yAxis: [{
                    scale: true,
                    axisLine: { lineStyle: { color: '#8392A5' } },
                    splitLine: { show: false }
                },{
                    scale: true,
                    gridIndex: 1,
                    splitNumber: 2,
                    axisLabel: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false}
                },{
                    scale: true,
                    gridIndex: 2,
                    splitNumber: 2,
                    axisLabel: {show: false},
                    axisLine: {show: false},
                    axisTick: {show: false},
                    splitLine: {show: false}
                }],
                grid: [{
                    left: 20,
                    right: 20,
                    top: 110,
                    height: 120
                }, {
                    left: 20,
                    right: 20,
                    height: 100,
                    top: 260
                }, {
                    left: 20,
                    right: 20,
                    height: 120,
                    top: 390
                }],
                dataZoom: [{
                    textStyle: {
                        color: '#8392A5'
                    },
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '80%',
                    xAxisIndex: [0, 1,2],
                    dataBackground: {
                        areaStyle: {
                            color: '#8392A5'
                        },
                        lineStyle: {
                            opacity: 0.8,
                            color: '#8392A5'
                        }
                    },
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    }
                }, {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                }],
                animation: false,
                series: [
                    {
                        name: 'Rocs',
                        type: 'line',
                        xAxisIndex: 1,
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#7fbe9e'
                            },
                            emphasis: {
                                color: '#140'
                            }
                        },
                        data: data.rocs
                    },
                    {
                        name: 'Volumes',
                        type: 'bar',
                        xAxisIndex: 2,
                        yAxisIndex: 2,
                        data: data.volumes
                    },
                    {
                        type: 'candlestick',
                        name: '日K',
                        data: data.values,
                        itemStyle: {
                            normal: {
                                color: '#FD1050',
                                color0: '#0CF49B',
                                borderColor: '#FD1050',
                                borderColor0: '#0CF49B'
                            }
                        }
                    },
                    {
                        name: 'MA5',
                        type: 'line',
                        data: calculateMA(5, data),
                        smooth: true,
                        lineStyle: {
                            normal: {opacity: 0.5}
                        }
                    },
                    {
                        name: 'MA10',
                        type: 'line',
                        data: calculateMA(10, data),
                        smooth: true,
                        lineStyle: {
                            normal: {opacity: 0.5}
                        }
                    },
                    {
                        name: 'MA20',
                        type: 'line',
                        data: calculateMA(20, data),
                        smooth: true,
                        lineStyle: {
                            normal: {opacity: 0.5}
                        }
                    },
                    {
                        name: 'MA30',
                        type: 'line',
                        data: calculateMA(30, data),
                        smooth: true,
                        lineStyle: {
                            normal: {opacity: 0.5}
                        }
                    },
                    {
                        name: 'MA60',
                        type: 'line',
                        data: calculateMA(60, data),
                        smooth: true,
                        lineStyle: {
                            normal: {opacity: 0.5}
                        }
                    },
                ]
            };

        myChart.setOption(option);
}

if(!queryObj.stockNum || !queryObj.range){
    alert("参数错误，请增加stockNum和range数值");
}else{
    let page = 1;
    let totalPage;
    let data = null; 
    const myChart = initChart();
    $.ajax(`/stock/${queryObj.stockNum}/range/${queryObj.range}/page/${page}`,{
        async:false,
        dataType: 'json',
        success: function(rawData){
            if(!rawData || !rawData.data || parseInt(rawData.totalNum) <= 0) return false;   
            data = splitData(data,rawData.data);
            const pageSize = rawData.pageSize;
            totalPage = Math.ceil(parseInt(rawData.totalNum) / pageSize);
            renderChart(myChart,data);
            $("#loading").remove();
            $("#name").text(rawData.name);
            page++;
        }
    });


    while(page<=totalPage){
        // console.log("page",page);
        // console.log("totalPage1",totalPage);
        $.ajax(`/stock/${queryObj.stockNum}/range/${queryObj.range}/page/${page}`, {
            async: false,
            dataType: 'json',
            success: function(rawData){
                if(!rawData || !rawData.data || parseInt(rawData.totalNum) <= 0) return false;   
                data = splitData(data,rawData.data);
                renderChart(myChart,data);
            }
        });
        page++;
    }
    
}

