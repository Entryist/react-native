import React from 'react'
import { TouchableOpacity, Text, StyleSheet, Image, View, Linking } from 'react-native'
import RNUrlPreview from 'react-native-url-preview'

import { DEFAULT_DOMAIN } from '../../../config'
import shared from './sharedStyles'
import { useParsedGiphyMsg } from '../../../store/hooks/msg'
import { useTheme } from '../../../store'
import ClipMessage from './clipMsg'
import BoostMessage from './boostMsg'
import BoostRow from './boostRow'
import TribeMsg from './tribeMsg'
import Typography from '../../common/Typography'

export default function TextMsg(props) {
  const theme = useTheme()
  const { message_content } = props
  const isLink = message_content && (message_content.toLowerCase().startsWith('http://') || message_content.toLowerCase().startsWith('https://'))

  function openLink() {
    Linking.openURL(message_content)
  }

  const showBoostRow = props.boosts_total_sats ? true : false

  const onLongPressHandler = () => props.onLongPress(props)

  const isGiphy = message_content && message_content.startsWith('giphy::')
  if (isGiphy) {
    const { url, aspectRatio, text } = useParsedGiphyMsg(message_content)
    return (
      <TouchableOpacity style={{ ...styles.column, maxWidth: 200 }} onLongPress={onLongPressHandler}>
        <Image source={{ uri: url }} style={{ width: 200, height: 200 / (aspectRatio || 1) }} resizeMode={'cover'} />
        {(text ? true : false) && (
          <Typography color={props.isMe ? theme.white : theme.text} size={16} styles={styles.textPad}>
            {text}
          </Typography>
        )}
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad marginTop={14} />}
      </TouchableOpacity>
    )
  }

  const isClip = message_content && message_content.startsWith('clip::')
  if (isClip) {
    return (
      <View style={styles.column}>
        <ClipMessage {...props} />
        {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} pad marginTop={8} />}
      </View>
    )
  }
  const isBoost = message_content && message_content.startsWith('boost::')
  if (isBoost) {
    return <BoostMessage {...props} />
  }

  const isTribe = message_content && message_content.startsWith(`${DEFAULT_DOMAIN}://?action=tribe`)
  if (isTribe) {
    return <TribeMsg {...props} />
  }

  return (
    <TouchableOpacity style={isLink ? { width: 280, paddingLeft: 7, minHeight: 72 } : shared.innerPad} onLongPress={onLongPressHandler}>
      {isLink ? (
        <View style={styles.linkWrap}>
          <TouchableOpacity onPress={openLink}>
            <Typography color={props.isMe ? theme.white : theme.blue} size={16}>
              {message_content}
            </Typography>
          </TouchableOpacity>
          <RNUrlPreview {...linkStyles(theme)} text={message_content} />
        </View>
      ) : (
        <Typography color={props.isMe ? theme.white : theme.text} size={16}>
          {message_content}
        </Typography>
      )}
      {showBoostRow && <BoostRow {...props} myAlias={props.myAlias} marginTop={8} />}
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
