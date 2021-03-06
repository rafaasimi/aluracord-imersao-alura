import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import appConfig from '../../config.json';
import { ButtonSendSticker } from '../components/ButtonSendSticker'

import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY)

function listenMessagesRealTime(newMessage) {
    return supabaseClient
        .from('messages')
        .on('INSERT', (responseRealTime) => {
            newMessage(responseRealTime.new);
        })
        .subscribe()
}

function deleteListenMessagesRealTime(deleteMessage) {
    return supabaseClient
        .from('messages')
        .on('DELETE', (responseRealTime) => {
            deleteMessage(responseRealTime.old);
        })
        .subscribe()
}


export default function ChatPage() {
    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([
        // {
        //     id: 1,
        //     text: ':sticker: https://i.ibb.co/JH17y5W/baby-yoda.png',
        //     user: 'rafaasimi'
        // }
    ])
    const [isLoaded, setIsLoaded] = useState(false)
    const roteamento = useRouter()
    const loggedUser = roteamento.query.username


    useEffect(() => {
        supabaseClient
            .from('messages')
            .select('*')
            .order('id', { ascending: false })
            .then(({ data }) => {
                setMessageList(data)
                setIsLoaded(true)
            })

        listenMessagesRealTime((newMessage) => {
            setMessageList((valorAtualdaLista) => {
                return [
                    newMessage,
                    ...valorAtualdaLista,
                ]
            })
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
            user: loggedUser,
        }

        supabaseClient
            .from('messages')
            .insert([message])
            .then(({ data }) => {
                // setMessageList([
                //     data[0],
                //     ...messageList,
                // ])
            })

        setMessage('')

    }

    function handleDeleteMessage(event) {
        const messageId = Number(event.target.dataset.id)

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

    if (!isLoaded) {
        return (
            <>
                <style global jsx>{`
                    .loading-image {
                        max-width: 200px;
                        max-height: 200px;
                        animation: rotation .5s linear infinite; 
                    }

                    @keyframes rotation {
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>

                <Box
                    styleSheet={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backgroundImage: 'url(https://wallpaperaccess.com/full/4858991.jpg)',
                        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                        color: appConfig.theme.colors.neutrals['000']
                    }}
                >

                    <img src="baby-yoda.png" className='loading-image' />
                </Box>
            </>
        )
    }

    if (isLoaded) {
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
                                gap: '16px',
                                height: '60px',
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
                                    height: '100%',
                                    border: '0',
                                    resize: 'none',
                                    borderRadius: '5px',
                                    padding: '6px 8px',
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                    color: appConfig.theme.colors.neutrals[200],
                                }}
                            />
                            <ButtonSendSticker
                                onStickerClick={(sticker) => {
                                    handleNewMessage(`:sticker: ${sticker}`)
                                }}
                            />

                            <Button
                                onClick={() => handleNewMessage(message)}
                                label='Enviar'
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
                        {messageItem.text?.startsWith(':sticker:')
                            ? (
                                <Image
                                    src={messageItem.text.replace(':sticker:', '')}
                                    styleSheet={
                                        {
                                            maxWidth: '150px',
                                        }
                                    }
                                />
                            )
                            : (
                                messageItem.text
                            )
                        }
                    </Text>

                )

            })
            }

        </Box>
    )
}