/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React, {useEffect, createRef, ReactChild} from 'react';
import {getNumberFormatter, styled, TimeseriesDataRecord} from '@superset-ui/core';
import { SupersetPluginChartMidiPluginProps, SupersetPluginChartMidiPluginStylesProps } from './types';


// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/core. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-core/src/style/index.ts

const Styles = styled.div<SupersetPluginChartMidiPluginStylesProps>`
  background-color: ${({ theme }) => theme.colors.secondary.light2};
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
`;

const CustomContainer = styled.div<SupersetPluginChartMidiPluginStylesProps>`
  background-color: inherit;
  padding: ${({theme})=>theme.gridUnit * 4}px;
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  column-gap: 30px;
  font-family: Geologica, sans-serif;
  height: 100%;

  .HC-data-list{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-basis: 33%;
  }
  .HC-name{
    font-size: 20px;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 24px;
  }
  .HC-value{
    font-size: 56px;
    font-weight: 500;
    line-height: 70px;
  }
  .HC-data-list:nth-child(2) .HC-value{
    color: #00A8A8;
  }
  .HC-data-list:nth-child(3) .HC-value{
    color: #959EAB;
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function SupersetPluginChartMidiPlugin(props: SupersetPluginChartMidiPluginProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width, filters } = props;

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to access the DOM and do whatever you want.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log('Plugin element', root);
  });

  const formatNumbers = props.formatNumbers;
  const formater = getNumberFormatter(formatNumbers);

  console.log('Plugin props', props);
  const isNumber = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);

  const component = (metrics: TimeseriesDataRecord): Array<ReactChild> => {
    const arr = [];
    if(metrics) {
      for(const metric in metrics){
        const value = metrics[metric];
        const isNum = isNumber(value);
        arr.push(
            <div className='HC-data-list' key={metric}>
              <span className='HC-name'>{metric}</span>
              <span className='HC-value'>{
                  isNum
                      ? formater(Number(value))
                      : value
              }</span>
            </div>
        )
      }
    }
    return arr;
  }
  if(data.length===1){
    return (
        <div>
            <h3>{props.headerText}</h3>
            <CustomContainer
                ref={rootElem}
                boldText={props.boldText}
                headerFontSize={props.headerFontSize}
                height={height}
                width={width}
            >
                {
                    component(data[0])
                }
            </CustomContainer>
            {filters &&
                <div>
                <h3>filtered by field(s):</h3>
                {Array.isArray(filters) && filters.map((filter) => (
                    <div key={filter.subject}>{filter.subject}</div>
                ))}
                </div>
            }
        </div>

    )
  }
    return (
        <Styles
            ref={rootElem}
            boldText={props.boldText}
            headerFontSize={props.headerFontSize}
            height={height}
            width={width}
        >
            <h1>Неверные данные</h1>

        </Styles>
    );
}
