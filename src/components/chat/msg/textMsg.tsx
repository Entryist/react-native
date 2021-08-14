import React, { useMemo } from 'react'
import { TouchableOpacity, Text, StyleSheet, Image, View, Linking } from 'react-native'
import RNUrlPreview from 'react-native-url-preview'
import * as linkify from 'linkifyjs'

import { useTheme } from '../../../store'
import { useParsedGiphyMsg } from '../../../store/hooks/msg'
import { DEFAULT_DOMAIN } from '../../../config'
import shared from './sharedStyles'
import ClipMessage from './clipMsg'
import BoostMessage from './boostMsg'
import BoostRow from './boostRow'
import TribeMsg from './tribeMsg'
import EmbedVideo from './embedVideo'
import Typography from '../../common/Typography'
import { getRumbleLink, getYoutubeLink } from './utils'

export default function TextMsg({message_content ,...props}) {
  const theme = useTheme()

  const rumbleLink = useMemo(() => getRumbleLink(message_content), [message_content])
  const youtubeLink = useMemo(() => getYoutubeLink(message_content), [message_content])
  const showBoostRow = props.boosts_total_sats ? true : false
  const isGiphy = message_content && message_content.startsWith('giphy::')
  const isClip = message_content && message_content.startsWith('clip::')
  const isBoost = message_content?.startsWith('boost::')
  const isTribe = message_content?.startsWith(`${DEFAULT_DOMAIN}://?action=tribe`)
  const isLink =
    message_content &&
    (message_content.toLowerCase().trim().startsWith('http://') ||
      message_content.toLowerCase().trim().startsWith('https://'))

  function openLink() {
    Linking.openURL(message_content)
  }
  const onLongPressHandler = () => props.onLongPress(props)

  /**
   * Returns
   */
  if (isGiphy) {
    // TODO: Move this block to a separated component 
    const { url, aspectRatio, text } = useParsedGiphyMsg(message_content)
    return (
      <TouchableOpacity
        style={{ ...styles.column, maxWidth: 200 }}
        onLongPress={onLongPressHandler}
      >
        <Image
          source={{ uri: url }}
          style={{ width: 200, height: 200 / (aspectRatio || 1) }}
          resizeMode={'cover'}
        />
        {(text ? true : false) && (
          <Typography
            color={props.isMe ? theme.white : theme.text}
            size={16}
            styles={styles.textPad}
          >
            {text}
          </Typography>
        )}
        {showBoostRow && (
          <BoostRow {...props} myAlias={props.myAlias} pad marginTop={14} />
        )}
      </TouchableOpacity>
    )
  }
  if (isClip) return (
    <View style={styles.column}>
      <ClipMessage {...props} />
      {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad />}
    </View>
  )
  if (isBoost) return <BoostMessage {...props} />
  if (isTribe) return <TribeMsg {...props} />
  if (rumbleLink || youtubeLink) return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={isLink ? { width: 280, paddingLeft: 7, minHeight: 72 } : shared.innerPad}
      onLongPress={onLongPressHandler}
    >
      {/* TODO: Refactor with a better logic */}
      {!!rumbleLink && <EmbedVideo type="rumble" link={rumbleLink} />}
      {!!youtubeLink && <EmbedVideo type="youtube" link={youtubeLink} />}
      {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} />}
    </TouchableOpacity>
  )
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={isLink ? { width: 280, paddingLeft: 7, minHeight: 72 } : shared.innerPad}
      onLongPress={onLongPressHandler}
    >
      {isLink ? (
        <View style={styles.linkWrap}>
          <TouchableOpacity onPress={openLink}>
            <Typography color={theme.text} size={15}>
              {message_content}
            </Typography>
          </TouchableOpacity>
          <RNUrlPreview {...linkStyles(theme)} text={message_content} />
        </View>
      ) : (
        <Typography color={theme.text} size={15}>
          {message_content}
        </Typography>
      )}
      {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} />}
    </TouchableOpacity>
  )
}

function linkStyles(theme) {
  return {
    containerStyle: {
      alignItems: 'center'
    },
    imageStyle: {
      width: 80,
      height: 80,
      paddingRight: 10,
      paddingLeft: 10
    },
    titleStyle: {
      fontSize: 14,
      color: theme.title,
      marginRight: 10,
      marginBottom: 5,
      alignSelf: 'flex-start',
      fontFamily: 'Helvetica'
    },
    descriptionStyle: {
      fontSize: 11,
      color: theme.subtitle, //"#81848A",
      marginRight: 10,
      alignSelf: 'flex-start',
      fontFamily: 'Helvetica'
    }
  }
}

const styles = StyleSheet.create({
  linkWrap: {
    display: 'flex'
  },
  link: {
    padding: 10,
    color: '#6289FD'
  },
  column: {
    display: 'flex',
    maxWidth: '100%'
  },
  textPad: {
    // color: '#333',
    // fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12
  },
  littleTitle: {
    fontSize: 11,
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12
  }
})
