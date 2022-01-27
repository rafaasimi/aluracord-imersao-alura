import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import { useState } from 'react';
import { useRouter } from 'next/router'
import appConfig from '../config.json'



function Title(props) {
    const HeadingTag = props.heading || 'h1'

    return (
        <>
            <HeadingTag>{props.children}</HeadingTag>

            {/* Estilos */}
            <style jsx>{`
            
            ${HeadingTag} {
                color: ${appConfig.theme.colors.neutrals['000']};
                font-weight: bold;
                font-size: 24px;
                line-height: 28px;
            }

            `}</style>
        </>
    )
}

// Componente React
// function HomePage() {
//     // JSX
//     return (
//         <>
//             <div>
//                 <GlobalStyle />
//                 <Title heading="h2">Boas vindas de volta!</Title>
//                 <h2>Aluracord - Alura Matrix</h2>
//             </div>


//         </>
//     )
// }

// export default HomePage

export default function PaginaInicial() {
    // const username = 'rafaasimi';
    const [username, setUsername] = useState('');
    const roteamento = useRouter();

    console.log();


    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backgroundImage: 'url(https://wallpaperaccess.com/full/4858991.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        border: '1px solid rgba( 255, 255, 255, 0.10 )',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 8px 32px 0 rgba( 0, 0, 0, 0.37 )',
                        backgroundColor: 'rgba( 255, 255, 255, 0.21 )',
                        backdropFilter: 'blur( 1px )'
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={function (event) {
                            event.preventDefault()
                            roteamento.push('/chat')
                        }}
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                    >
                        <Title tag="h2">Como sei que posso confiar em você?</Title>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                            value={username}
                            onChange={function Handler(event) {
                                setUsername(event.target.value)
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                            disabled={username.length < 2 ? 'disabled' : ''}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={username ? `https://github.com/${username}.png` : `https://avatars.githubusercontent.com/u/9919?s=280&v=4`}
                        />
                        {!username ? "" : (
                            <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            {username}
                        </Text>
                        )}
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}