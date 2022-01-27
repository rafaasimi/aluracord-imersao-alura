import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

export default function ChatPage() {
    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4NTkwNiwiZXhwIjoxOTU4ODYxOTA2fQ.ytgMF_N89xVP5rgPtv2eHlDmZG-tLcyqc3szrSYeb9c'
    const SUPABASE_URL = 'https://wnqdcabnlddyntengxyu.supabase.co'

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessageList(data)
            })
    }, [])


    function handleNewMessage(newMessage) {

        if (!newMessage) {
            return
        }

        if (newMessage.trim() === '') {
            return
        }

        const message = {
            // id: messageList.length + Math.floor((Math.random() * 1000)),
            text: newMessage.trim(),
            user: 'rafaasimi',
        }

        supabaseClient
            .from('messages')
            .insert([message])
            .then(({ data }) => {
                setMessageList([
                    data[0],
                    ...messageList,
                ])
            })



        setMessage('')

    }

    function handleDeleteMessage(event) {
        const messageId = Number(event.target.dataset.id)
        console.log(messageId);
        
        supabaseClient
            .from('messages')
            .delete()
            .match({ id: messageId })
            .then(({ data }) => {
                const messageListFiltered = messageList.filter((messageFiltered) => {
                    return messageFiltered.id != data[0].id
                })

                setMessageList(messageListFiltered)
            })



    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.6)',
                backgroundImage: 'url(https://wallpaperaccess.com/full/4858991.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: 'rgba( 255, 255, 255, 0.21 )',
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: 'rgba( 0, 0, 0, 0.21 )',
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList messageList={messageList} handleDeleteMessage={handleDeleteMessage} />
                    {/* Lista de mensagens:
                    <ul>
                        {messageList.map((messageItem) => {
                            return (
                                <li key={messageItem.id}>
                                    {messageItem.user}: {messageItem.text}
                                </li>
                            )
                        })}
                    </ul> */}

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => {
                                setMessage(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            onClick={() => handleNewMessage(message)}
                            label='Entrar'
                            fullWidth
                            styleSheet={{
                                maxWidth: '100px',
                            }}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {

    const handleDeleteMessage = props.handleDeleteMessage

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.messageList.map((messageItem) => {

                return (
                    <Text
                        key={messageItem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            wordBreak: 'break-word',
                            hover: {
                                backgroundColor: 'rgba( 0, 0, 0, 0.21 )',
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${messageItem.user}.png`}
                            />
                            <Text tag="strong">
                                {messageItem.user}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Text
                                onClick={handleDeleteMessage}
                                styleSheet={{
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    marginLeft: 'auto',
                                    color: '#FFF',
                                    backgroundColor: 'rgba(0,0,0,.5)',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                }}
                                tag="span"
                                data-id={messageItem.id}
                            >
                                X
                            </Text>
                        </Box>
                        {messageItem.text}
                    </Text>

                )

            })
            }

        </Box>
    )
}