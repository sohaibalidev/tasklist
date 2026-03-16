import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Task, TaskPriority, Project } from '../../types/database';
import { COLORS } from '../../constants/colors';
import { PriorityBadge } from '../ui/priority-badge';
import { Button } from '../ui/Button';

interface TaskFormProps {
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description?: string;
        priority: TaskPriority;
        project_id: string | null;
    }) => void;
    initialData?: Task;
    projects: Project[];
    selectedProjectId?: string | null;
    isEditing?: boolean;
}

const PRIORITY_OPTIONS: TaskPriority[] = ['low', 'medium', 'high'];

export const TaskForm = ({
    onClose,
    onSubmit,
    initialData,
    projects,
    selectedProjectId,
    isEditing = false,
}: TaskFormProps) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');
    const [projectId, setProjectId] = useState<string | null>(
        initialData?.project_id || selectedProjectId || null
    );
    const [showProjectPicker, setShowProjectPicker] = useState(false);

    useEffect(() => {
        setTitle(initialData?.title || '');
        setDescription(initialData?.description || '');
        setPriority(initialData?.priority || 'medium');
        setProjectId(initialData?.project_id || selectedProjectId || null);
    }, [initialData, selectedProjectId]);

    const handleSubmit = () => {
        if (!title.trim()) return;
        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            project_id: projectId,
        });
    };

    const selectedProject = projects.find(p => p.id === projectId);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{isEditing ? 'Edit Task' : 'New Task'}</Text>
                <Button
                    icon="x"
                    onPress={onClose}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter task title"
                        placeholderTextColor={COLORS.ui.textSecondary}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description (Optional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Add more details"
                        placeholderTextColor={COLORS.ui.textSecondary}
                        multiline
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Priority</Text>
                    <View style={styles.priorityContainer}>
                        {PRIORITY_OPTIONS.map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[
                                    styles.priorityOption,
                                    {
                                        borderColor: COLORS.priority[p],
                                        backgroundColor: priority === p ? COLORS.priority[p] + 40 : 'transparent',
                                    },
                                ]}
                                onPress={() => setPriority(p)}
                            >
                                <PriorityBadge priority={p} size="medium" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Project</Text>
                    <TouchableOpacity
                        style={styles.projectSelector}
                        onPress={() => setShowProjectPicker(true)}
                    >
                        <Text style={selectedProject ? styles.selectedText : styles.placeholderText}>
                            {selectedProject ? selectedProject.title : 'Select a project'}
                        </Text>
                        <Feather name="chevron-down" size={20} color={COLORS.ui.textSecondary} />
                    </TouchableOpacity>
                </View>

                <Button
                    variant="submit"
                    text={isEditing ? 'Update' : 'Create'}
                    onPress={handleSubmit}
                    disabled={!title.trim()}
                />
            </ScrollView>

            <Modal
                visible={showProjectPicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowProjectPicker(false)}
            >
                <View style={styles.pickerModal}>
                    <View style={styles.pickerContent}>
                        <View style={styles.pickerHeader}>
                            <Text style={styles.pickerTitle}>Select Project</Text>
                            <Button
                                icon="x"
                                onPress={() => setShowProjectPicker(false)}
                            />
                        </View>

                        <ScrollView>
                            <TouchableOpacity
                                style={styles.projectItem}
                                onPress={() => {
                                    setProjectId(null);
                                    setShowProjectPicker(false);
                                }}
                            >
                                <View style={styles.projectIcon}>
                                    <Feather name="inbox" size={20} color={COLORS.ui.textSecondary} />
                                </View>
                                <View style={styles.projectInfo}>
                                    <Text style={styles.projectTitle}>No Project</Text>
                                    <Text style={styles.projectSubtitle}>Tasks without a project</Text>
                                </View>
                                {projectId === null && (
                                    <Feather name="check" size={20} color={COLORS.priority.medium} />
                                )}
                            </TouchableOpacity>

                            {projects.map((project) => (
                                <TouchableOpacity
                                    key={project.id}
                                    style={styles.projectItem}
                                    onPress={() => {
                                        setProjectId(project.id);
                                        setShowProjectPicker(false);
                                    }}
                                >
                                    <View style={styles.projectIcon}>
                                        <Feather name="folder" size={20} color={COLORS.ui.text} />
                                    </View>
                                    <View style={styles.projectInfo}>
                                        <Text style={styles.projectTitle}>{project.title}</Text>
                                    </View>
                                    {projectId === project.id && (
                                        <Feather name="check" size={20} color={COLORS.priority.medium} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.ui.text,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.ui.textSecondary,
        marginBottom: 8,
    },
    required: {
        color: COLORS.ui.error,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: COLORS.ui.text,
        backgroundColor: COLORS.ui.background,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    priorityOption: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 12,
        padding: 8,
        alignItems: 'center',
    },
    priorityOptionSelected: {
        backgroundColor: COLORS.ui.card,
    },
    projectSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: COLORS.ui.border,
        borderRadius: 12,
        padding: 12,
        backgroundColor: COLORS.ui.background,
    },
    selectedText: {
        fontSize: 16,
        color: COLORS.ui.text,
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.ui.textSecondary,
    },
    pickerModal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    pickerContent: {
        backgroundColor: COLORS.ui.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.ui.text,
    },
    projectItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.ui.border,
    },
    projectIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: COLORS.ui.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    projectInfo: {
        flex: 1,
    },
    projectTitle: {
        fontSize: 16,
        color: COLORS.ui.text,
        marginBottom: 4,
    },
    projectSubtitle: {
        fontSize: 12,
        color: COLORS.ui.textSecondary,
    },
});