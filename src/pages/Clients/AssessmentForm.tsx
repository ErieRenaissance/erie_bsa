// src/pages/Clients/AssessmentForm.tsx

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAssessments } from '../../hooks/useAssessments';
import { supabase } from '../../lib/supabaseClient';

interface AssessmentFormProps {
  clientId: string;
  onClose: () => void;
}

type Question = {
  id: string;
  section_id: string;
  question: string;
  order_index: number;
};

type Section = {
  id: string;
  title: string;
  order_index: number;
  questions: Question[];
};

const answerSchema = z.object({
  questionId: z.string(),
  answer: z.string().min(1, 'Answer is required'),
});

const assessmentSchema = z.object({
  date: z.string().min(1, 'Assessment date is required'),
  notes: z.string().optional(),
  responses: z.array(answerSchema),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

export function AssessmentForm({ clientId, onClose }: AssessmentFormProps) {
  const { createAssessment } = useAssessments(clientId);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AssessmentFormData>();

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data: rawSections, error: sectionError } = await supabase
        .from('biz_support_app.assessment_question_sections')
        .select('id, title, order_index')
        .order('order_index', { ascending: true });

      const { data: rawQuestions, error: questionError } = await supabase
        .from('biz_support_app.assessment_questions')
        .select('id, section_id, question, order_index')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (sectionError || questionError) {
        console.error('Failed to load assessment questions:', sectionError || questionError);
        return;
      }

      const sectionMap = rawSections.map((section) => ({
        ...section,
        questions: rawQuestions.filter((q) => q.section_id === section.id),
      }));

      setSections(sectionMap);
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const onSubmit = async (data: AssessmentFormData) => {
    try {
      const assessment = await createAssessment.mutateAsync({
        date: new Date(data.date),
        notes: data.notes,
        status: 'scheduled',
      });

      for (const response of data.responses) {
        await supabase.from('biz_support_app.assessment_responses').insert({
          assessment_id: assessment.id,
          question_id: response.questionId,
          answer: response.answer,
        });
      }

      onClose();
    } catch (error) {
      console.error('Error creating assessment:', error);
    }
  };

  if (loading) return null;

  return (
    <Transition.Root show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-3 w-full">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    New Business Assessment
                  </Dialog.Title>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assessment Date</label>
                      <input
                        type="date"
                        {...register('date')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                      {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>}
                    </div>

                    {sections.map((section, sIndex) => (
                      <div key={section.id} className="border-t pt-4">
                        <h4 className="text-md font-semibold text-gray-800 mb-2">{section.title}</h4>
                        {section.questions.map((q, qIndex) => {
                          const fieldName = `responses.${sIndex * 100 + qIndex}`;
                          return (
                            <div key={q.id} className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {q.question}
                              </label>
                              <textarea
                                {...register(`responses.${fieldName}.answer` as const)}
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                              />
                              <input
                                type="hidden"
                                value={q.id}
                                {...register(`responses.${fieldName}.questionId` as const)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                      <textarea
                        {...register('notes')}
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                      >
                        Submit Assessment
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
