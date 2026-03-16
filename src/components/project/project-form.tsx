import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PROJECT_ICONS, ProjectIcon } from '../../constants/icons';
import { COLORS } from '../../constants/colors';
import { Project } from '../../types/database';
import { Button } from '../ui/Button';
import { Input } from '../ui/input';

interface ProjectFormProps {
    onClose: () => void;
    onSubmit: (data: { title: string; icon_name: string }) => void;
    initialData?: Project;
    isEditing?: boolean;
}

export const ProjectForm = ({
    onClose,
    onSubmit,
    initialData,
    isEditing = false,
}: ProjectFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [selectedIcon, setSelectedIcon] = useState(initialData?.icon_name || PROJECT_ICONS[0].id);
    const [showIconPicker, setShowIconPicker] = useState(false);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit({ title: title.trim(), icon_name: selectedIcon });
    };

    const renderIconItem = ({ item }: { item: ProjectIcon }) => {
        const IconComponent = item.icon;
        const isSelected = selectedIcon === item.id;

        return (
            <TouchableOpacity
                style={[styles.iconItem, isSelected && styles.selectedIconItem]}
                onPress={() => {
                    setSelectedIcon(item.id);
                    setShowIconPicker(false);
                }}
            >
                <IconComponent size={32} color={isSelected ? COLORS.ui.background : item.color} />
                <Text style={[styles.iconItemName, isSelected && styles.selectedIconItemName]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const selectedIconData = PROJECT_ICONS.find(i => i.id === selectedIcon);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{isEditing ? 'Edit Project' : 'New Project'}</Text>
                <Button
                    icon="x"
                    iconColor={'black'}
                    onPress={onClose}
                />
            </View>

            <Input
                label="Project Name"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Work"
            />

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Project Icon</Text>
                <TouchableOpacity style={styles.iconSelector} onPress={() => setShowIconPicker(true)}>
                    <View style={styles.selectedIconPreview}>
                        {selectedIconData && (
                            <>
                                <selectedIconData.icon size={24} color={selectedIconData.color} />
                                <Text style={styles.selectedIconName}>{selectedIconData.name}</Text>
                            </>
                        )}
                    </View>
                    <Feather name="chevron-down" size={20} color={COLORS.ui.textSecondary} />
                </TouchableOpacity>
            </View>

            <Button
                variant="submit"
                text={isEditing ? 'Update' : 'Create'}
                onPress={handleSubmit}
                disabled={!title.trim()}
            />

            {showIconPicker && (
                <View style={styles.pickerOverlay}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Choose Icon</Text>
                        <Button
                            icon="x"
                            onPress={() => setShowIconPicker(false)}
                        />
                    </View>
                    <FlatList
                        data={PROJECT_ICONS}
                        renderItem={renderIconItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20, backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    title: { fontSize: 20, fontWeight: '600', color: COLORS.ui.text },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, color: COLORS.ui.textSecondary, marginBottom: 8 },
    iconSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: COLORS.ui.border, borderRadius: 12, padding: 12 },
    selectedIconPreview: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    selectedIconName: { fontSize: 16, color: COLORS.ui.text },
    pickerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: COLORS.ui.background, zIndex: 20 },
    pickerHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.ui.border },
    pickerTitle: { fontSize: 18, fontWeight: '600' },
    iconItem: { flex: 1, alignItems: 'center', padding: 16, margin: 8, borderRadius: 12, backgroundColor: COLORS.ui.card },
    selectedIconItem: { backgroundColor: COLORS.priority.medium },
    iconItemName: { marginTop: 8, fontSize: 14, color: COLORS.ui.text },
    selectedIconItemName: { color: COLORS.ui.background },
});