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
import RumbleVideo from './rumbleVideo'
import Typography from '../../common/Typography'

export default function TextMsg(props) {
  const theme = useTheme()
  const { message_content } = props
  const isLink =
    message_content &&
    (message_content.toLowerCase().trim().startsWith('http://') ||
      message_content.toLowerCase().trim().startsWith('https://'))

  const rumbleLink = useMemo(() => {
    const messageLinks = linkify.find(message_content, 'url')
    const rumbleLink = messageLinks.find(messageLink => messageLink.href.startsWith('https://rumble.com/'))
    return rumbleLink?.href ?? ""
  }, [message_content])

  function openLink() {
    Linking.openURL(message_content)
  }

  const showBoostRow = props.boosts_total_sats ? true : false

  const onLongPressHandler = () => props.onLongPress(props)

  const isGiphy = message_content && message_content.startsWith('giphy::')
  if (isGiphy) {
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

  const isClip = message_content && message_content.startsWith('clip::')
  if (isClip) {
    return (
      <View style={styles.column}>
        <ClipMessage {...props} />
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad />}
      </View>
    )
  }
  const isBoost = message_content && message_content.startsWith('boost::')
  if (isBoost) {
    return <BoostMessage {...props} />
  }

  const isTribe =
    message_content && message_content.startsWith(`${DEFAULT_DOMAIN}://?action=tribe`)
  if (isTribe) {
    return <TribeMsg {...props} />
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={isLink ? { width: 280, paddingLeft: 7, minHeight: 72 } : shared.innerPad}
      onLongPress={onLongPressHandler}
    >
      {isLink && !rumbleLink ? (
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
      {!!rumbleLink && <RumbleVideo link={rumbleLink}/>}
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
