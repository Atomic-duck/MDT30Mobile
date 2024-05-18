import { Callout, PointAnnotation } from "@rnmapbox/maps";
import { Position } from "@rnmapbox/maps/lib/typescript/types/Position";
import { useRef } from "react";
import { Image, StyleSheet, View } from "react-native";

import pinImg from "../../images/pin.png"
import Pin from "../../images/location-pin.png"

type AnnotationWithImageProps = {
   id: string;
   title: string;
   coordinate: Position;
   onDragEnd: ((payload: any) => void);
};

const ANNOTATION_SIZE = 32;

const AnnotationWithImage = ({
   id,
   coordinate,
   title,
   onDragEnd
}: AnnotationWithImageProps) => {
   const pointAnnotation = useRef<PointAnnotation>(null);

   return (
      <PointAnnotation
         id={id}
         coordinate={coordinate}
         title={title}
         draggable
         onDragEnd={onDragEnd}
         ref={pointAnnotation}
         anchor={{ x: 0.5, y: 1 }}
      >
         <View style={styles.annotationContainer}>
            <Image
               source={Pin}
               onLoad={() => {
                  pointAnnotation.current?.refresh()
               }}
               // Prevent rendering bitmap at unknown animation state
               fadeDuration={0}
            />
         </View>
         <Callout title={title} />
      </PointAnnotation>
   );
};

export default AnnotationWithImage;

const styles = StyleSheet.create({
   annotationContainer: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      height: ANNOTATION_SIZE,
      justifyContent: 'center',
      overflow: 'hidden',
      width: ANNOTATION_SIZE,
   }
});