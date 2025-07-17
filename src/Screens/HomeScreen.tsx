import React, {useState, useEffect, useRef} from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity} from 'react-native'

interface FeedItem {
id: string;
title: string;
imageUrl: string
}

const dummyData = (): FeedItem[] => {
    return Array.from({length: 1000 }, (_, index) => ({
        id: index.toString(),
        title: `Item #${index + 1}`,
        imageUrl: 'https://via.placeholder.com/150'
    }))
}

const MemomizedItem = React.memo(({ title, imageUrl}: { title: string; imageUrl: string}) => (
    <View style={styles.itemContainer}>
        <Image source={{ uri: imageUrl}} style={styles.image} />
        <Text>{title}</Text>
    </View>
))

const HomeScreen = () => {
    const [data, setData] = useState<FeedItem[]>([])
    const [loading, setLoading] = useState(true)
    const flatListRef = useRef<FlatList>(null)
    const [showScrollTop, setShowScrollTop] = useState(false)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setData(dummyData())
            setLoading(false)
        }, 900)
        return () => clearTimeout(timer)
    }, [])

    const handleScroll = (event: any) => {
        const yOffset = event.nativeEvent.contentoffset.y
        setShowScrollTop(yOffset > 300)
    }

    return (
        <View style={{ flex: 1}}>
            {loading ? <ActivityIndicator size='large' style={{marginTop: 54}} /> :
            (
                <FlatList 
                ref={flatListRef}
                data={data}
                onScroll={handleScroll}
                keyExtractor={(item) => item.id}
                renderItem={({ item}) => <MemomizedItem title={item.title} imageUrl={item.imageUrl} />}
                ListHeaderComponent={<Text style={styles.stcikyHeader}>Feed List</Text>}
                stickyHeaderIndices={[0]}
                />
            )
            }
            {showScrollTop && (
                <TouchableOpacity onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true})}>
                <Text>Scroll toTop</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    stcikyHeader: {
        fontSize: 12
    }
})