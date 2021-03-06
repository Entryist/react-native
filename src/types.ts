import { Chat } from './store/chats'
import { Contact } from './store/contacts'
import { RouteProp } from '@react-navigation/native'

export type DashStackParamList = {
  Home: undefined
  Chat: Chat
}

export type ContactsStackParamList = {
  Contacts: undefined
  Contact: Contact
}

export type ChatRouteProp = RouteProp<DashStackParamList, 'Chat'>

export declare type Font = {
  fontFamily: string
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
}
