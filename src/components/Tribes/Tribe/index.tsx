import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native'
import { useObserver } from 'mobx-react-lite'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TabView } from 'react-native-tab-view'

import { useStores, useTheme, hooks } from '../../../store'
import BackHeader from '../../common/BackHeader'
import Divider from '../../common/Layout/Divider'
import TribeSettings from '../../common/Dialogs/TribeSettings'
import Tabs from '../../common/Tabs'
import Intro from './Intro'
import About from './About'
import Media from './Media'

const { useTribes } = hooks

export default function Tribe({ route }) {
  const theme = useTheme()
  const navigation = useNavigation()
  const [tribeDialog, setTribeDialog] = useState(false)
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'Media' },
    { key: 'second', title: 'About' }
  ])
  const { ui, chats } = useStores()
  const isFocused = useIsFocused()

  return useObserver(() => {
    const tribes = useTribes()
    const tribe =
      tribes.find(t => t.uuid === route.params.tribe.uuid) || route.params.tribe

    function fetchTribes() {
      chats.getTribes()
    }

    useEffect(() => {
      fetchTribes()
    }, [isFocused])

    function onEditTribePress() {
      navigation.navigate('EditTribe', { tribe })
    }

    function onTribeMembersPress() {
      navigation.navigate('TribeMembers', { tribe })
    }

    const renderScene = ({ route }) => {
      switch (route.key) {
        case 'first':
          return <Media tribe={tribe} />
        case 'second':
          return <About tribe={tribe} />
        default:
          return null
      }
    }

    return (
      <SafeAreaView style={{ ...styles.wrap, backgroundColor: theme.bg }}>
        <BackHeader
          // title={tribe.name}
          navigate={() => navigation.goBack()}
          // border
          action={
            // tribe.owner && (
            <TribeHeader tribe={tribe} openDialog={() => setTribeDialog(true)} />
            // )
          }
        />
        <ScrollView>
          <View style={styles.content}>
            <Intro tribe={tribe} />
            <Divider mt={30} mb={0} />
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={props => <Tabs {...props} />}
            />
          </View>
        </ScrollView>

        {/* {tribe.owner && ( */}
        <TribeSettings
          visible={tribeDialog}
          owner={tribe.owner}
          onCancel={() => setTribeDialog(false)}
          onEditPress={onEditTribePress}
          onMembersPress={onTribeMembersPress}
        />
        {/* )} */}
      </SafeAreaView>
    )
  })
}

function TribeHeader({ tribe, openDialog }) {
  const theme = useTheme()

  return (
    <IconButton
      icon={() => (
        <MaterialCommunityIcon name='dots-horizontal' color={theme.icon} size={30} />
      )}
      onPress={openDialog}
    />
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1
    // paddingBottom: 30
  },
  content: {
    flex: 1,
    paddingTop: 10
    // paddingRight: 14,
    // paddingLeft: 14
  }
})