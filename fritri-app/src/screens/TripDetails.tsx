import { useTheme, useTranslation } from '../hooks';
import {Block, Button, Input, Image, Text} from '../components/';

const TripDetails = () => {
    const {assets, sizes, colors} = useTheme();
    const IMAGE_SIZE = (sizes.width - (sizes.padding + sizes.sm) * 2) / 5;
    const IMAGE_MARGIN = (sizes.width - IMAGE_SIZE * 3 - sizes.padding * 2) / 5;
  
    return (
      <Block safe>
      <Block
        scroll
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: sizes.s}}>
        <Block>
          <Block 
          //marginTop={sizes.m} 
          paddingHorizontal={sizes.padding}>
          <Text h4 marginVertical={sizes.s}>
              Paseito a la playa!!!
          </Text>
          <Block marginBottom={sizes.m}>
            <Image
              resizeMode="cover"
              source={assets.carousel1}
              style={{width: '100%'}}
            />
            
            <Block row 
              align="flex-start" 
              justify="flex-start"
              marginTop={sizes.sm}>
              <Image
                  radius={0}
                  source={assets.location}
                  style={{tintColor: colors.secondary}}
                />
              <Text p secondary
                marginBottom={sizes.s}
                marginLeft={sizes.s}>
                Puerto Viejo, Costa Rica
              </Text>
            </Block>                 
            <Block row 
              align="flex-start" 
              justify="flex-start"
              marginTop={sizes.sm}>
              <Image
                  radius={0}
                  source={assets.calendar}
                  style={{tintColor: colors.secondary}}
                />
              <Text p secondary
                marginBottom={sizes.s}
                marginLeft={sizes.s}>
                22 de Octubre de 2022
              </Text>
            </Block> 

            {/* Usuario */}
            <Block row marginLeft={sizes.xs} marginBottom={sizes.xs} marginTop={sizes.sm}>
              <Image
                source={assets.avatar2}
                style={{width: sizes.xl, height: sizes.xl, borderRadius: sizes.s}}
              />
              <Block marginLeft={sizes.s}>
                <Text p semibold>
                  Andres Hidalgo
                </Text>
                <Text p gray>
                  Posted on 28 February
                </Text>
              </Block>
            </Block>

          </Block>

          {/* Restaurantes */}
          <Block color='yellow'>
            <Block row marginBottom={sizes.sm} color='green'>
              <Text h5 semibold>
                Restaurantes
              </Text>
            </Block>
            <Block row color='red' flex={0} marginBottom={sizes.sm}>
              <Image
                resizeMode="cover"
                source={assets?.photo1}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                }}
              />

              <Block color='white' >
                <Text p secondary
                  marginBottom={sizes.s}
                  marginLeft={sizes.s}>
                  Puerto Viejo, Costa Rica
                </Text>
              </Block>                 
              <Block color='pink' >
                <Text p secondary
                  marginBottom={sizes.s}
                  marginLeft={sizes.s}>
                  22 de Octubre de 2022
                </Text>
              </Block>
              <Block color='orange' align='center' justify='center'>
                <Image
                    radius={0}
                    source={assets.calendar}
                    style={{tintColor: colors.black}}
                  />
              </Block>                  

            </Block>


            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo2}
                marginBottom={IMAGE_MARGIN}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                }}
              />
            </Block>
            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo3}
                marginBottom={IMAGE_MARGIN}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                }}
              />
            </Block>
          </Block>

         {/* Atracciones */}
         <Block>
            <Block row marginBottom={sizes.s}>
              <Text h5 semibold>
                Atracciones Turísticas
              </Text>
            </Block>
            <Block row justify="space-between">
              <Image
                resizeMode="cover"
                source={assets?.photo4}
                marginBottom={IMAGE_MARGIN}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                }}
              />
            </Block>
            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo5}
                marginBottom={IMAGE_MARGIN}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                }}
              />
            </Block>
            <Block row justify="space-between" wrap="wrap">
              <Image
                resizeMode="cover"
                source={assets?.photo6}
                marginBottom={IMAGE_MARGIN}
                style={{
                  height: IMAGE_SIZE,
                  width: IMAGE_SIZE,
                }}
              />
            </Block>
          </Block>

          </Block>
        </Block>
      </Block>
    </Block>
    );
  };

  export default TripDetails;