import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ChatQuote, BoostIcon, Forward30, Back15 } from './icons'
import Slider from '@material-ui/core/Slider';
import * as Audio from './audio'
import moment from 'moment'
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

export default function AudioPlayer({ url, clickBoost, clickMsg, onPlay, onRewind, onForward, duration, ts, playing, onSeek }) {

  const [position, setPosition] = useState(0) // number 0-100
  const [rateChoice, setRateChoice] = useState(1) // number 0.5 - 4.0
  const [rateSelect, setRateSelect] = useState(false)

  useEffect(() => {
    if ((ts || ts === 0) && duration) {
      setPosition((ts / duration) * 100) // calc position from TS
    }
  }, [ts, duration])

  function onChange(e, percent) {
    setPosition(percent)
  }

  function onChangeCommitted(e, percent) {
    if (duration && (percent || percent === 0)) {
      onSeek(duration * (percent / 100))
    }
  }
  // @ts-ignore
  const progressText = moment.duration(ts, 'seconds').format('hh:mm:ss')
  // @ts-ignore
  const durationText = moment.duration(duration, 'seconds').format('hh:mm:ss')
  const playStyle = { fontSize: 42, color: '#6089ff', marginLeft: 12, marginRight: 12, cursor: 'pointer' }

  function HandleRateChange(newRate) {
    setRateChoice(newRate)
    Audio.setRate(newRate)
    setRateSelect(false)
  }

  const rateChoices = [0.5, 0.8, 1, 1.2, 1.5, 2.1]

  return <Wrap>
    <Top>
      <Text style={{ left: 0 }}>{progressText}</Text>
      <Slider
        onChangeCommitted={onChangeCommitted}
        aria-labelledby="value-slider"
        min={0}
        max={100}
        value={position}
        onChange={onChange}
        valueLabelDisplay="off"
      />
      <Text style={{ right: 0 }}>{durationText}</Text>
    </Top>
    {rateSelect ?
      <RateSelect>
        {rateChoices.map((r) => <RateBox key={r + ''}
          style={{ background: r === rateChoice && '#3d6189' }}
          onClick={() => HandleRateChange(r)} >
          {r}x
          </RateBox>
        )}
      </RateSelect> :
      <RateDisplay onClick={() => setRateSelect(true)}>{rateChoice}x</RateDisplay>}
    {url && <Bottom>
      <MsgWrap>
        <ChatQuote style={{ height: 24, width: 24 }} onClick={clickMsg} />
      </MsgWrap>
      <Back15 onClick={onRewind}
        style={{ fill: '#809ab7', marginRight: 10, height: 24, width: 24, cursor: 'pointer' }}
      />
      {playing ? <PauseCircleFilledIcon onClick={onPlay}
        style={playStyle}
      /> : <PlayCircleFilledIcon onClick={onPlay}
        style={playStyle}
        />}
      <Forward30 onClick={onForward}
        style={{ fill: '#809ab7', marginLeft: 10, height: 24, width: 24, cursor: 'pointer' }}
      />
      <BoostWrap>
        <Boost style={{ height: 24, width: 24 }} onClick={clickBoost} />
      </BoostWrap>
    </Bottom>}
  </Wrap>
}
function Boost({ onClick, style }) {
  return <BoostGreen onClick={onClick} style={style || {}}>
    <BoostIcon style={{ height: 20, width: 20 }} />
  </BoostGreen>
}

const RateBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  background: #222e3a;
  margin: 0px 5px;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
`

const RateSelect = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const RateDisplay = styled.div`
  font-size: 12px;
  cursor: pointer;
`

const BoostGreen = styled.div`
  background:#48c998;
  height:24px;
  width:24px;
  border-radius:100%;
  display:flex;
  align-items:center;
  justify-content:center;
`

const Wrap = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
`
const Top = styled.div`
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  margin: 0 20px 20px 20px;
  width:85%;
`
const Bottom = styled.div`
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
`

const Text = styled.div`
  color:#8b98b4;
  font-size:11px;
  position:absolute;
  bottom:-10px;
`
const MsgWrap = styled.div`
  position:absolute;
  left:16px;
  top:9px;
  color:white;
  cursor:pointer;
  & svg {
    color:#809ab7;
  }
  &:hover svg{
    color:white;
  }
`
const BoostWrap = styled.div`
  position:absolute;
  right:16px;
  top:9px;
  color:white;
  cursor:pointer;
  & svg {
    color:#809ab7;
  }
  &:hover svg{
    color:white;
  }
`