import {View, Text, Modal, Pressable} from 'react-native';
import { GlassView } from 'expo-glass-effect';
import { memo, useState } from 'react'
import * as Haptics from 'expo-haptics';
import { cssInterop } from 'nativewind';
cssInterop(GlassView, { className: 'style' });

type TransactionComponentProps = {
    description: string;
    category: string;
    amount: number;
    value_date: string
}

function TransactionComponent({description, category, amount, value_date }:TransactionComponentProps){

    const categoryColors: Record<string, string> = {
    "overføring": "bg-pink-100 border-pink-200",
    "dagligvarer": "bg-green-100 border-green-200",
    "transport": "bg-blue-100 border-blue-200",
    "restaurant": "bg-orange-100 border-orange-200",
    "shopping": "bg-purple-100 border-purple-200",
    "other" : "bg-blue-100 border-blue-200",
    "takeaway" : "bg-orange-100 border-orange-200",
    "sosialt" : "bg-yellow-100 border-yellow-200",
    "reise" : "bg-teal-100 border-teal-200",
    "trening" : "bg-red-100 border-red-200",
    "elektronikk" : "bg-blue-300 border-blue-400",
    "lønn" : "bg-green-300 border-green-400"

  // Add your other categories here
    };

    const categoryEmojis: Record<string, string> = {
    dagligvarer: "🛒",
    transport: "🚗",
    restaurant: "🍽️",
    shopping: "🛍️",
    overføring: "💸",
    reise: "🏝️",
    trening:"🏋️",
    takeaway: "🥡",
    sosialt: "🍻",
    elektronikk: "⚡️",
    lønn: "💰",
    klær: "👕",
    abbonementer: "💳",
    'snacks og småkjøp': "🍫",
    underholdning: '🍿',
    };


    const emoji = categoryEmojis[category.trim().toLowerCase()] ?? "📦";
    const [modalVisible, setModalVisible] = useState(false)

function displayCategory(category: string) {
  const colors =
    categoryColors[category.trim().toLowerCase()] ??
    "bg-gray-100 border-gray-300";

    return (
        <View
        className={`w-[22%] items-center justify-center border rounded-full px-2 py-1 ${colors}`}
        >
            <Text className="text-xs" numberOfLines={1} ellipsizeMode="tail">
                {emoji} {category}
            </Text>
        </View>
    );
    }

    function formatDate(date : string){
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const parts = date.split("-")
        const day = parseInt(parts[2])
        const month = months[parseInt(parts[1].slice(-1), 10) - 1]
        const year = parts[0]

        return day + ". " + month + " " + year
    }

    function formatDescription(description : string){
        const parts = description.split(" ")

        let result = "";
        for(const part of parts){
            if (/^-?\d+$/.test(part) && part.length >= 5 ) {
                continue;
            }
            if( part === "Notanr" ){
                continue;
            }
            result += part + " "
        }
        return result.trim()
    }

    function chooseAmountColor(){
        if(amount > 0 ) {return "text-green-500"}
        else if(amount < 0) {return"text-red-500"}
        else { return "text-gray-500"}
    }

    function formatAmount(amount: number): string {
        return new Intl.NumberFormat('nb-NO', {
            style: 'currency',
            currency: 'NOK',
        }).format(amount / 100);
    }


    return(
        <>
    <Pressable onLongPress={() => {
        void 
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setModalVisible(true);
        }}
       
        >
    <GlassView glassEffectStyle="regular" style={{ 
                paddingHorizontal: 5, 
                paddingLeft: 10,
                paddingVertical: 5, 
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                
                }}
                className="bg-white"
                >

        <Text className="flex-1 min-w-0 text-xs" numberOfLines={1} ellipsizeMode="tail">
                {formatDescription(description)}
        </Text>

        <Text
            className={`w-[20%] text-xs text-right ${chooseAmountColor()}`}
            style={{ fontVariant: ['tabular-nums'] }}
            numberOfLines={1}
            >
            {formatAmount(amount)}
        </Text>

        <Text className="w-[22%] text-xs text-center" numberOfLines={1}>
            {formatDate(value_date)}
        </Text>

        {displayCategory(category)}

    </GlassView>
    </Pressable>



    <Modal visible={modalVisible} transparent animationType="fade">
   
    <View className="flex-1 justify-center items-center">
         <GlassView
            glassEffectStyle="regular"
            className="w-[90%] flex flex-col   
            justify-between gap-4 p-5 
            rounded-2xl "
            >

            <Text>{description}</Text>

            <Text className={` ${chooseAmountColor()}`} >{formatAmount(amount)}</Text>

            <Text className="self-start text-md text-center" numberOfLines={1}>
                {formatDate(value_date)}
            </Text>

            {displayCategory(category)}

            <Pressable onPress={() => setModalVisible(false)} className="self-start border border-gray-300 rounded-xl px-2 py-1 w-fit">
                <Text className="text-black">Close</Text>
            </Pressable>

            
        </GlassView>
    </View>

    </Modal>
    </>
    )
}

export default memo(TransactionComponent);
