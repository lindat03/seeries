import React, { useEffect, useState } from 'react';
import { Keyboard, Pressable, Text, TextInput, View } from 'react-native';

type Props = {
    placeholder?: string;
    initialValues?: string;
    debounceMs?: number;
    minChars?: number;
    onSubmit: (query: string) => void;
}

/*
    TODO: implement live/debounced search
*/
function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);

    return debounced;
}

export default function SearchBar({
    placeholder = "Search TV shows...",
    initialValues = "",
    debounceMs = 500,
    minChars = 2,
    onSubmit
}: Props) {
    const [query, setQuery] = useState(initialValues);
    const disabled = query.trim().length < minChars;

    const handleSubmit = () => {
        const q = query.trim();
        if (q.length < minChars) return;

        Keyboard.dismiss();
        onSubmit(q);
    }

    // const debouncedQuery = useDebouncedValue(query, debounceMs);

    // useEffect(() => {
    //     const q = debouncedQuery.trim();
    //     if (q.length === 0) {
    //         onSearch('');
    //         return;
    //     }
    //     if (q.length >= minChars) {
    //         onSearch(q);
    //     }
    // }, [minChars, onSearch, debouncedQuery]);

    // const showClear = useMemo(() => query.trim().length > 0, [query]);

    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 14,
                backgroundColor: "#fff",
            }}
        >
            <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                style={{
                flex: 1,
                fontSize: 16,
                paddingVertical: 6,
                }}
            />

            {/* {showClear && (
                <Pressable
                onPress={() => setQuery("")}
                hitSlop={10}
                style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 10,
                    backgroundColor: "#f2f2f2",
                }}
                >
                <Text style={{ fontSize: 14 }}>Clear</Text>
                </Pressable>
            )} */}

            <Pressable
                onPress={handleSubmit}
                disabled={disabled}
                style={{
                paddingVertical: 12,
                borderRadius: 14,
                alignItems: "center",
                backgroundColor: disabled ? "#ddd" : "#111",
                }}
            >
                <Text style={{ color: disabled ? "#666" : "#fff", fontSize: 16, fontWeight: "600" }}>
                Search
                </Text>
            </Pressable>
        </View>
  );
}