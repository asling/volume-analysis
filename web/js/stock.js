var upColor = '#00da3c';
var downColor = '#ec0000';

function splitData(rawData) {
    var categoryData = [];
    var values = [];
    var rocs = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i]['date']);
        values.push(rawData[i]['prices']);
        rocs.push([i, rawData[i]['rocs']]);
    }

    return {
        categoryData: categoryData,
        values: values,
        rocs: rocs
    };
}


var myChart = echarts.init(document.getElementById('main'));
console.log("myChart");
$.get('/stock/000002/range/21', function (rawData) {
    
    var data = splitData(rawData);
    console.log("data",data);
    myChart.setOption(option = {
        backgroundColor: '#fff',
        animation: false,
        legend: {
            bottom: 10,
            left: 'center',
            data: ['Dow-Jones index',]
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {top: 10};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            }
            // extraCssText: 'width: 170px'
        },
        axisPointer: {
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                brush: {
                    type: ['lineX', 'clear']
                }
            }
        },
        brush: {
            xAxisIndex: 'all',
            brushLink: 'all',
            outOfBrush: {
                colorAlpha: 0.1
            }
        },
        visualMap: {
            show: false,
            seriesIndex: 5,
            dimension: 2,
            pieces: [{
                value: 1,
                color: downColor
            }, {
                value: -1,
                color: upColor
            }]
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                height: '50%'
            },
            {
                left: '10%',
                right: '8%',
                top: '63%',
                height: '16%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: data.categoryData,
                scale: true,
                boundaryGap : false,
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    z: 100
                }
            },
            {
                type: 'category',
                gridIndex: 1,
                data: data.categoryData,
                scale: true,
                boundaryGap : false,
                axisLine: {onZero: false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
                // axisPointer: {
                //     label: {
                //         formatter: function (params) {
                //             var seriesValue = (params.seriesData[0] || {}).value;
                //             return params.value
                //             + (seriesValue != null
                //                 ? '\n' + echarts.format.addCommas(seriesValue)
                //                 : ''
                //             );
                //         }
                //     }
                // }
            }
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: {show: false},
                axisLine: {show: false},
                axisTick: {show: false},
                splitLine: {show: false}
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 1],
                start: 98,
                end: 100
            },
            {
                show: true,
                xAxisIndex: [0, 1],
                type: 'slider',
                top: '85%',
                start: 98,
                end: 100
            }
        ],
        series: [
            {
                name: 'Dow-Jones index',
                type: 'candlestick',
                data: data.values,
                itemStyle: {
                    normal: {
                        color: upColor,
                        color0: downColor,
                        borderColor: null,
                        borderColor0: null
                    }
                },
                tooltip: {
                    formatter: function (param) {
                        param = param[0];
                        return [
                            'Date: ' + param.name + '<hr size=1 style="margin: 3px 0">',
                            'Open: ' + param.data[0] + '<br/>',
                            'Close: ' + param.data[1] + '<br/>',
                            'Lowest: ' + param.data[2] + '<br/>',
                            'Highest: ' + param.data[3] + '<br/>'
                        ].join('');
                    }
                }
            },    
            {
                name: 'rocs',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: data.rocs
            }
        ]
    }, true);

    // myChart.on('brushSelected', renderBrushed);

    // function renderBrushed(params) {
    //     var sum = 0;
    //     var min = Infinity;
    //     var max = -Infinity;
    //     var countBySeries = [];
    //     var brushComponent = params.brushComponents[0];

    //     var rawIndices = brushComponent.series[0].rawIndices;
    //     for (var i = 0; i < rawIndices.length; i++) {
    //         var val = data.values[rawIndices[i]][1];
    //         sum += val;
    //         min = Math.min(val, min);
    //         max = Math.max(val, max);
    //     }

    //     panel.innerHTML = [
    //         '<h3>STATISTICS:</h3>',
    //         'SUM of open: ' + (sum / rawIndices.length).toFixed(4) + '<br>',
    //         'MIN of open: ' + min.toFixed(4) + '<br>',
    //         'MAX of open: ' + max.toFixed(4) + '<br>'
    //     ].join(' ');
    // }

    myChart.dispatchAction({
        type: 'brush',
        areas: [
            {
                brushType: 'lineX',
                coordRange: ['2017-06-02', '2017-06-20'],
                xAxisIndex: 0
            }
        ]
    });
});